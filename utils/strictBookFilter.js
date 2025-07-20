export const strictBookFilter = (books, titleQuery, authorQuery) => {
  const normalizedTitle = titleQuery.toLowerCase();
  const normalizedAuthor = authorQuery.toLowerCase();

  //Step 1: filter to books that are relevant to query params
  const filteredBooks = books.filter((book) => {
    const bookTitle = book.volumeInfo.title?.toLowerCase() || "";
    const bookAuthors =
      book.volumeInfo.authors?.join(" ").toLowerCase().trim() || "";

    const titleMatch = bookTitle.includes(normalizedTitle);
    const authorMatch = bookAuthors.includes(normalizedAuthor);

    return authorMatch && titleMatch;
  });

  //Step 2: group and dedupe
  const grouped = new Map();

  for (const book of filteredBooks) {
    const info = book.volumeInfo || {};
    const keyTitle = info.title?.toLowerCase().trim() || "";
    const keyAuthor = info.authors?.join(" ").toLowerCase().trim() || "";
    const key = `${keyTitle}|${keyAuthor}`;

    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(book);
  }

  //Selection criteria (for choosing best option of duplicates)
  const selectBestEdition = (books) => {
    if (books.length === 1) return books[0]; //duplicates do not exist

    //finds books with valid image, publisher, and published date
    const booksWithCompleteData = books.filter((book) => {
      const info = book.volumeInfo || {};
      return (
        (info.imageLinks?.smallThumbnail || info.imageLinks?.thumbnail) &&
        info.publisher &&
        info.publishedDate
      );
    });

    if (booksWithCompleteData.length > 0) {
      booksWithCompleteData.sort((a, b) => {
        const dateA = new Date(a.volumeInfo.publishedDate || "9999-12-31");
        const dateB = new Date(b.volumeInfo.publishedDate || "9999-12-31");
        return dateA - dateB;
      });
      return booksWithCompleteData[0];
    }

    return books[0];
  };

  return Array.from(grouped.values()).map(selectBestEdition);
};
