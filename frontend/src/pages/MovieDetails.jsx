import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { API_KEY, TMDB_BASE_URL } from "../lib/constants"
import BlurCircle from "../components/BlurCircle"
import { Heart, PlayCircleIcon, StarIcon } from "lucide-react"
import { formatRuntime } from "../lib/functions"
import DateSelect from "../components/DateSelect"
import MovieCard from "../components/MovieCard"
import MovieDetailsSkeleton from "../components/MovieDetailsSkeleton"


const MovieDetails = () => {
  const { id } = useParams()
  const [movie, setMovie] = useState({})
  const navigate = useNavigate()
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    (async function fetchMovie() {
      try {
        setLoading(true)
        const res = await axios.get(`${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR&append_to_response=credits,images,recommendations,videos`)

        setMovie(res.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])
  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      try {
        const recommendationIds = movie.recommendations?.results?.slice(0, 4).map((rec) => rec.id) || [];
        const recommendedMovies = await Promise.all(
          recommendationIds.map(async (id) => {
            const res = await axios.get(`${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`);
            return res.data;
          })
        );
        setRecommendedMovies(recommendedMovies);
      } catch (error) {
        console.log("Erro ao buscar filmes recomendados:", error);
      }
    };

    if (movie.recommendations?.results?.length > 0) {
      fetchRecommendedMovies();
    }
  }, [movie]);

  console.log(movie)
  const genres = movie.genres?.map((g) => g.name).join(" | ")
  const trailer = movie.videos?.results?.find(video => video.type === "Trailer" && video.site === "YouTube")

  if (loading) return <MovieDetailsSkeleton />
  return (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover" alt={movie.title} />
        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />
          <p className="text-primary">{movie.spoken_languages?.map((language) => (
            <span className="ml-1">{language.name}</span>
          ))}</p>
          <h1 className="text-4xl font-semibold max-w-96 text-balance">{movie.title}</h1>
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {movie.vote_average?.toFixed(1)}
          </div>
          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">{movie.overview}</p>
          <p>{formatRuntime(movie.runtime)}  •  {genres}  •  {new Date(movie.release_date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
          })}
          </p>
          <div className="flex items-center flex-wrap gap-4 mt-4">
            {trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95"
              >
                <PlayCircleIcon className="w-5 h-5" />
                Assistir Trailer
              </a>
            )}

            <a href="#dateSelect" className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95">Comprar ingresso</a>
            <button className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
              <Heart className={`w-5 h-5 `} />
            </button>
          </div>
        </div>
      </div>
      <p className="text-lg font-mediun mt-20">Elenco</p>
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4">
          {movie.credits?.cast?.slice(0, 12).map((cast, i) => (
            <div className="flex flex-col items-center text-center" key={i}>
              <img src={`https://image.tmdb.org/t/p/w185/${cast.profile_path}`} className="rounded-full h-25 aspect-square object-cover" alt={cast.name} />
              <p className="font-medium text-xs mt-3">{cast.name}</p>
            </div>
          ))}
        </div>
      </div>
      <DateSelect id={movie.id} />
      <p className="text-lg font-medium mt-20 mb-8">
        Você também poderá gostar
      </p>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {recommendedMovies.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
      <div className="flex justify-center mt-20">
        <button className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer" onClick={() => navigate("/movies")}>
          Ver Mais
        </button>
      </div>
    </div>
  )
}

export default MovieDetails