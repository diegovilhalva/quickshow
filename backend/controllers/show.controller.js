import axios from "axios";
import Movie from "../models/movie.model.js";
import Show from "../models/show.model.js";
import { inngest } from "../inngest/index.js";

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

         await inngest.send({
            name: "app/show.added",
             data: {movieTitle: movie.title}
         })

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


export const getShows = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const allShows = await Show.find({ showDateTime: { $gte: new Date() } })
            .populate("movie")
            .sort({ showDateTime: 1 });

        const map = new Map();
        allShows.forEach((show) => {
            const movieId = show.movie._id.toString();
            if (!map.has(movieId)) {
                map.set(movieId, {
                    movie: show.movie,
                    seatsBooked: Object.keys(show.occupiedSeats).length,
                    showPrice: show.showPrice,
                    showDateTime: show.showDateTime
                });
            }
        });

        const uniqueShows = Array.from(map.values());
        const paginated = uniqueShows.slice(skip, skip + limit);
        const totalPages = Math.ceil(uniqueShows.length / limit);

        return res.status(200).json({
            success: true,
            shows: paginated,
            totalPages
        });
    } catch (error) {
        console.error("Erro ao buscar shows:", error);
        return res.status(500).json({ success: false, message: "Erro interno." });
    }
};


/*
export const getShows = async (req, res) => {
    try {
        const shows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie').sort({ showDateTime: 1 })

        const uniqueShows = new Set(shows.map((show) => show.movie))

        res.status(200).json({ success: true, shows: Array.from(uniqueShows) })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Ocorreu um erro, tente novamente mais tarde" })
    }
}*/



export const getShow = async (req, res) => {
    try {
        const { movieId } = req.params

        const shows = await Show.find({ movie: movieId, showDateTime: { $gte: new Date() } })

        const movie = await Movie.findById(movieId)
        
        const dateTime = {}

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0]
            if (!dateTime[date]) {
                dateTime[date] = []
            }
            dateTime[date].push({ time: show.showDateTime, showId: show._id })
        })

        res.status(200).json({ success: true, movie, dateTime })
    } catch (error) {
        console.error("Erro ao buscar show:", error);
        return res
            .status(500)
            .json({ success: false, message: "Erro interno, tente novamente." });
    }
}