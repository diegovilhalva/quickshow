import axios from "axios";
import Movie from "../models/movie.model.js";
import Show from "../models/show.model.js";

export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

 
    let movie = await Movie.findOne({ tmdbId: movieId });

    
    if (!movie) {
      const { data: movieData } = await axios.get(
        `${process.env.TMDB_BASE_URL}/movie/${movieId}`,
        { params: { api_key: process.env.TMDB_API_KEY, language: "pt-BR" } }
      );

      const { data: videosData } = await axios.get(
        `${process.env.TMDB_BASE_URL}/movie/${movieId}/videos`,
        { params: { api_key: process.env.TMDB_API_KEY } }
      );
      const trailer = videosData.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );

      movie = await Movie.create({
        tmdbId: movieData.id,
        title: movieData.title,
        poster: movieData.poster_path,
        backdrop: movieData.backdrop_path,
        overview: movieData.overview,
        releaseDate: movieData.release_date,
        genres: movieData.genres.map((g) => g.name),
        rating: movieData.vote_average,
        runtime: movieData.runtime,
        language: movieData.original_language,
        trailer: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "",
        isNowShowing: true,
      });
    }

   
    const showsToCreate = showsInput.flatMap(({ date, times }) =>
      times.map((time) => ({
        movie: movie._id,
        showDateTime: new Date(`${date}T${time}`),
        showPrice,
      }))
    );

  
    let createdShows = [];
    if (showsToCreate.length) {
      createdShows = await Show.insertMany(showsToCreate);
    }

 
    return res
      .status(201)
      .json({ success: true, message: "Sessões adicionadas com sucesso.", createdShows });

  } catch (error) {
    console.error("Erro ao adicionar sessões:", error);
    return res
      .status(500)
      .json({ success: false, message: "Erro ao adicionar sessões" });
  }
};
