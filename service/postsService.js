/**
 * what things does the posts service care about?
 *
 * first, what things does it not care about?
 * -db structure/queries
 * -data schema validation handled by controller (so we assume all data we need is present)
 *
 * so, whats left?
 * -confirm we aren't duplicating media id & user id (user already submitted a post)
 * -confirm post exists when updating/deleting it.
 * -
 * -probably should write validator class first
 */
