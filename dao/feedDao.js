import db from "../db/db.js";
import { transformReturnFeedData } from "../transformers/transformData.js";
import {
  clubMediaColumnsToReturn,
  clubThreadColumnsToReturn,
  reviewsColumnsToReturn,
} from "./config/returnColumnsConfig.js";

class FeedDao {
  async getUserFeed(
    currentUserId,
    cursors = {
      reviewsCursor: null,
      clubMediaCursor: null,
      clubThreadCursor: null,
    },
    limit = 30
  ) {
    const { reviewsCursor, clubMediaCursor, clubThreadCursor } = cursors;

    const buildDataObject = (columns) => {
      const jsonPairs = columns
        .map((col) => {
          let colRef, key;
          if (col.includes(" as ")) {
            [colRef, key] = col.split(" as ").map((s) => s.trim());
          } else {
            colRef = col;
            key = col.split(".").pop(); // just the column name
          }
          return `'${key}', ${colRef}`;
        })
        .join(", ");

      const jsonRaw = db.raw(`jsonb_build_object(${jsonPairs}) as data`);

      return jsonRaw;
    };

    //reviews subquery
    const jsonReviewRaw = buildDataObject(reviewsColumnsToReturn);

    const reviewsQb = db("reviews as r")
      .join("users as u", "r.user_id", "u.id")
      .join("media as m", "r.media_id", "m.id")
      .leftJoin("review_club_shares as rcs", "r.id", "rcs.review_id")
      .leftJoin("club_members as cm", function () {
        this.on("cm.club_id", "rcs.club_id").andOnVal(
          "cm.user_id",
          currentUserId
        );
      })
      .where((qb) => {
        qb.where("r.private", false).orWhereNotNull("cm.user_id");
      })
      .modify((qb) => {
        if (reviewsCursor) {
          qb.andWhere("r.id", "<", reviewsCursor);
        }
      })
      .orderBy("r.id", "desc")
      .limit(limit)
      .groupBy("r.id", "r.created_at", "u.id", "m.id")
      .select(
        "r.id",
        "r.created_at",
        db.raw("array_remove(array_agg(rcs.club_id), null) as clubs"),
        db.raw("'reviews' as type"),
        db.raw("CONCAT('review-', r.id) as id_with_type"),
        jsonReviewRaw
      );

    //club media subquery
    const jsonClubMediaRaw = buildDataObject(clubMediaColumnsToReturn);

    const clubMediaQb = db("club_media as cmd")
      .join("clubs as c", "cmd.club_id", "c.id")
      .join("club_members as cm", "c.id", "cm.club_id")
      .join("media as m", "cmd.media_id", "m.id")
      .leftJoin("users as u", "cmd.assigned_by", "u.id")
      .where("cm.user_id", currentUserId)
      .modify((qb) => {
        if (clubMediaCursor) {
          qb.andWhere("cmd.id", "<", clubMediaCursor);
        }
      })
      .orderBy("cmd.id", "desc")
      .limit(limit)
      .select(
        "cmd.id",
        "cmd.assigned_at as created_at",
        db.raw("NULL as clubs"), // placeholder to match reviews
        db.raw("'clubMedia' as type"),
        db.raw("CONCAT('club_media-', cmd.id) as id_with_type"),
        jsonClubMediaRaw
      );

    //club threads subquery
    const jsonThreadRaw = buildDataObject(clubThreadColumnsToReturn);

    const clubThreadsQb = db("threads as t")
      .join("users as u", "t.created_by", "u.id")
      .join("club_media as cmd", "t.club_media_id", "cmd.id")
      .join("club_members as cm", "cmd.club_id", "cm.club_id")
      .where("cm.user_id", currentUserId)
      .andWhereNot("t.title", "Open Discussion")
      .modify((qb) => {
        if (clubThreadCursor) {
          qb.andWhere("t.id", "<", clubThreadCursor);
        }
      })
      .orderBy("t.id", "desc")
      .limit(limit)
      .select(
        "t.id",
        "t.created_at",
        db.raw("NULL as clubs"), // placeholder to match reviews
        db.raw("'clubThreads' as type"),
        db.raw("CONCAT('thread-', t.id) as id_with_type"),
        jsonThreadRaw
      );

    //Build feed query
    const reviewsSub = db.raw("(?)", [reviewsQb]);
    const clubMediaSub = db.raw("(?)", [clubMediaQb]);
    const clubThreadsSub = db.raw("(?)", [clubThreadsQb]);

    const feedQb = db
      .from(function () {
        this.unionAll([reviewsSub, clubMediaSub, clubThreadsSub]).as(
          "feed_union"
        );
      })
      .orderBy([
        { column: "created_at", order: "desc" },
        { column: "id_with_type", order: "desc" },
      ])
      .limit(limit);

    const feedRows = await feedQb;

    const feed = transformReturnFeedData(feedRows);

    return feed;
  }
}

export default new FeedDao();
