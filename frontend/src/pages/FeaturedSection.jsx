import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router"
import BlurCircle from "../components/BlurCircle"
import { useState, useEffect } from "react"
import axios from "axios"
import { API_KEY, TMDB_BASE_URL } from "../lib/constants"
import MovieCard from "../components/MovieCard"

const FeaturedSection = () => {
  const navigate = useNavigate()
  const [featuredMovies, setFeaturedMovies] = useState([])

  useEffect(() => {
    (async function fetchMovies() {
      try {
        const res = await axios.get(`${TMDB_BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=pt-BR&page=1`)
        const topEight = res.data.results.slice(0, 8)

        const details = await Promise.all(
          topEight.map((movie) =>
            axios
              .get(`${TMDB_BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&language=pt-BR`)
              .then((res) => res.data)
          )
        )

        setFeaturedMovies(details)
      } catch (err) {
        console.error("Erro ao buscar filmes em cartaz:", err)
      }
    })()
  }, [])

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <div className="relative flex items-center justify-between pt-20 pb-20">
        <BlurCircle top="0" right="-80px" />
        <p className="text-gray-300 font-medium text-lg">Em Cartaz</p>
        <button
          onClick={() => navigate("/movies")}
          className="group flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
        >
          Ver Tudo <ArrowRight className="group-hover:translate-x-0.5 transition w-4.5 h-4.5" />
        </button>
      </div>

      <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8">
        {featuredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate("/movies")
            scrollTo(0, 0)
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Ver Mais
        </button>
      </div>
    </div>
  )
}

export default FeaturedSection
