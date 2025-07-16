export const strictBookFilter = (books, titleQuery, authorQuery) => {
  const normalizedTitle = titleQuery.toLowerCase();
  const normalizedAuthor = authorQuery.toLowerCase();

  const strictBooks = books.filter((book) => {
    const bookTitle = book.volumeInfo.title?.toLowerCase() || "";
    const bookAuthors = book.volumeInfo.authors.join(" ").toLowerCase() || "";

    const titleMatch = bookTitle.includes(normalizedTitle);
    const authorMatch = bookAuthors.includes(normalizedAuthor);

    return authorMatch && titleMatch;
  });

  return strictBooks;
};
