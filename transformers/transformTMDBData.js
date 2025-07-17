export const transformMovies = (movieData) => {
  const cleanedItems = (movieData.results || []).map((movie) => ({
    mediaType: "movie",
    mediaKey: movie.id,
    title: movie.title || "Unknown Title",
    releaseDate: movie.release_date ?? null,
    description: movie.overview ?? null,
    smallPoster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
      : null,
    largePoster: movie?.poster_path
      ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
      : null,
  }));

  return { ...movieData, results: cleanedItems };
};
