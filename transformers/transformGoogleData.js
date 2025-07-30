//helper functions
function formatAuthors(authors) {
  if (!authors || authors.length === 0) return "Unknown Author";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return authors.join(" & ");
  //Format with commas if authors are 3 or more
  return authors.slice(0, -1).join(", ") + ", & " + authors.slice(-1);
}

const parseBookCategories = (categories = []) => {
  const cleaned = categories.flatMap((cat) => {
    const parts = cat.split("/").map((part) => part.trim());
    return parts.length ? parts : [];
  });

  return [...new Set(cleaned)]; // Remove duplicates
};

const addFifeParam = (url, size = 175) => {
  if (!url) return null;
  return url.includes("?") ? `${url}&fife=w${size}` : `${url}?fife=w${size}`;
};

//transform functions
export const transformBooks = (bookData) => {
  const cleanedItems = (bookData.items || []).map((book) => ({
    mediaType: "book",
    mediaKey: book.id,
    title: book.volumeInfo?.title ?? "Unknown Title",
    authors: formatAuthors(book.volumeInfo?.authors),
    releaseDate: book.volumeInfo?.publishedDate ?? null,
    artSmall:
      book.volumeInfo?.imageLinks?.smallThumbnail ??
      book.volumeInfo?.imageLinks?.thumbnail ??
      null,
  }));

  return { ...bookData, items: cleanedItems };
};

export const transformFullBook = (book) => {
  const cleaned = {
    mediaType: "book",
    mediaKey: book.id,
    title: book.volumeInfo?.title ?? "Unknown Title",
    authors: formatAuthors(book.volumeInfo?.authors),
    publisher: book.volumeInfo?.publisher ?? "Unknown Publisher",
    releaseDate: book.volumeInfo?.publishedDate ?? null,
    description: book.volumeInfo?.description ?? "",
    artSmall:
      book.volumeInfo?.imageLinks?.smallThumbnail ??
      book.volumeInfo?.imageLinks?.thumbnail ??
      null,
    artLarge:
      addFifeParam(book.volumeInfo?.imageLinks?.smallThumbnail) ??
      addFifeParam(book.volumeInfo?.imageLinks?.thumbnail) ??
      null,
    genres: parseBookCategories(book.volumeInfo?.categories),
    pageCount: book.volumeInfo?.pageCount,
  };

  return cleaned;
};
