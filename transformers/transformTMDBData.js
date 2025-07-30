export const transformMovies = (movieData) => {
  const cleanedItems = (movieData.results || []).map((movie) => ({
    mediaType: "movie",
    mediaKey: movie.id,
    title: movie.title || "Unknown Title",
    releaseDate: movie.release_date ?? null,
    artSmall: movie.poster_path
      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
      : null,
  }));

  return { ...movieData, results: cleanedItems };
};

export const transformFullMovie = (movie) => {
  const cleaned = {
    mediaType: "movie",
    mediaKey: movie.id,
    title: movie.title || "Unknown Title",
    releaseDate: movie.release_date ?? null,
    description: movie.overview ?? null,
    artSmall: movie.poster_path
      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
      : null,
    artLarge: movie.poster_path
      ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
      : null,
    genres: movie.genres?.map((genreObj) => genreObj?.name) ?? [],
    runtime: movie.runtime,
  };

  return cleaned;
};
