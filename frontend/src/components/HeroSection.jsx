import { useEffect, useState } from "react"
import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react"
import { useNavigate } from "react-router"
import axios from "axios"

// Swiper
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, EffectFade } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-fade"
import { API_KEY, TMDB_BASE_URL } from "../lib/constants"
import { formatRuntime } from "../lib/functions"



const HeroSection = () => {
  const [movies, setMovies] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${TMDB_BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=pt-BR&page=1`)
        const topFive = res.data.results.slice(0, 5)

        const details = await Promise.all(
          topFive.map((movie) =>
            axios
              .get(`${TMDB_BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&language=pt-BR`)
              .then((res) => res.data)
          )
        )

        setMovies(details)
      } catch (err) {
        console.error("Erro ao buscar filmes:", err)
      }
    }

    fetchMovies()
  }, [])


  if (movies.length === 0) return null

  return (
    <div className="relative h-screen">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        className="h-full"
      >
        {movies.map((movie) => {
          const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
          const genreNames = movie.genres?.map((g) => g.name).join(" | ")
          const releaseYear = movie.release_date?.split("-")[0]

          return (
            <SwiperSlide key={movie.id}>
              <div
                className="flex flex-col items-start justify-center gap-4 px-4 md:px-16 lg:px-36 bg-cover bg-center h-full text-white"
                style={{ backgroundImage: `url(${backdropUrl})` }}
              >
                <div className="backdrop-blur  p-4 rounded-xl max-w-3xl">
                  <h1 className="text-4xl md:text-5xl font-semibold mb-2">{movie.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-200 text-sm mb-2">
                    {genreNames && <span>{genreNames}</span>}
                    {releaseYear && (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {releaseYear}
                      </div>
                    )}
                    {movie.runtime && (
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {formatRuntime(movie.runtime)}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-300 mb-4 line-clamp-5">{movie.overview}</p>
                  <button
                    className="flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
                    onClick={() => navigate("/movies")}
                  >
                    Explorar Filmes
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default HeroSection
