import { useEffect, useState } from "react"
import axios from "axios"
import ReactPlayer from "react-player"
import BlurCircle from "./BlurCircle"
import { PlayCircleIcon } from "lucide-react"
import { API_KEY, TMDB_BASE_URL } from "../lib/constants"

const TrailerSection = () => {
  const [trailers, setTrailers] = useState([])
  const [currentTrailer, setCurrentTrailer] = useState(null)

  useEffect(() => {
    const fetchTrailers = async () => {
      try {
        
        const res = await axios.get(`${TMDB_BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=pt-BR&page=1`)
        const movies = res.data.results.slice(0, 5)

        
        const trailersData = await Promise.all(
          movies.map(async (movie) => {
            const videosRes = await axios.get(`${TMDB_BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}&language=pt-BR`)
            const trailer = videosRes.data.results.find(v => v.type === "Trailer" && v.site === "YouTube")

            return trailer
              ? {
                  title: movie.title,
                  videoUrl: `https://www.youtube.com/watch?v=${trailer.key}`,
                  image: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
                }
              : null
          })
        )

        const filteredTrailers = trailersData.filter(Boolean)
        setTrailers(filteredTrailers)
        setCurrentTrailer(filteredTrailers[0])
      } catch (err) {
        console.error("Erro ao buscar trailers:", err)
      }
    }

    fetchTrailers()
  }, [])

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">Trailers</p>
      <div className="relative mt-6">
        <BlurCircle top="-100px" right="-100px" />
        {currentTrailer && (
          <ReactPlayer
            url={currentTrailer.videoUrl}
            controls={true}
            className="mx-auto max-w-full"
            width="960px"
            height="540px"
          />
        )}
      </div>

      <div className="group grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
        {trailers.map((trailer, idx) => (
          <div
            key={idx}
            className="relative group-hover:not-hover:opacity-50 hover:-translate-y-1 duration-300 transition max-md:h-60 md:max-h-60 cursor-pointer"
            onClick={() => setCurrentTrailer(trailer)}
          >
            <img
              src={trailer.image}
              alt={trailer.title}
              className="rounded-lg w-full h-full object-cover brightness-75"
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-8 md:w-10 h-8 md:h-10 transform -translate-x-1/2 -translate-y-1/2 text-white"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrailerSection
