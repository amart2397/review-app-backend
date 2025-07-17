function formatAuthors(authors) {
  if (!authors || authors.length === 0) return "Unknown Author";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return authors.join(" & ");
  //Format with commas if authors are 3 or more
  return authors.slice(0, -1).join(", ") + ", & " + authors.slice(-1);
}

export const transformBooks = (bookData) => {
  const cleanedItems = (bookData.items || []).map((book) => ({
    mediaType: "book",
    mediaKey: book.id,
    title: book.volumeInfo?.title ?? "Unknown Title",
    authors: formatAuthors(book.volumeInfo?.authors),
    publisher: book.volumeInfo?.publisher ?? "Unknown Publisher",
    releaseDate: book.volumeInfo?.publishedDate ?? null,
    description: book.volumeInfo?.description ?? "",
    coverSmall: book.volumeInfo?.imageLinks?.smallThumbnail ?? null,
    coverLarge: book.volumeInfo?.imageLinks?.thumbnail ?? null,
  }));

  return { ...bookData, items: cleanedItems };
};
