import { useEffect, useState } from "react"
import axios from "axios"
import MovieCard from "../components/MovieCard"
import BlurCircle from "../components/BlurCircle"
import { API_KEY, TMDB_BASE_URL } from "../lib/constants"
import MovieCardSkeleton from "../components/MovieCardSkeleton"
import { userAppContext } from "../context/AppContext"

const Movies = () => {

  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const { shows,totalPages,setTotalPages,fetchShows } = userAppContext()

  useEffect(() => {
    setLoading(true)
    fetchShows(page).finally(() => setLoading(false))
  }, [page])


  const nextPage = () => {
    if (page < totalPages) setPage(page + 1)
  }

  const prevPage = () => {
    if (page > 1) setPage(page - 1)
  }

  return (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="15px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className="text-lg font-medium my-4">Os melhores filmes em cartaz</h1>

      {loading ? (
        <div className="flex flex-wrap max-sm:justify-center gap-8 mt-10">
          {Array(8).fill(0).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </div>
      ) : shows.length > 0  ? (
        <>
          <div className="flex flex-wrap max-sm:justify-center gap-8">
            {shows.map((movie) => (
              <MovieCard key={movie._id} movie={movie.movie} />
            ))}
          </div>

          {/* Paginação */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className="px-4 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-white mt-2">Página {page} de {totalPages}</span>
            <button
              onClick={nextPage}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </>
      ) : !loading && shows.length === 0 && (
        <p className="text-center my-20 text-red-400">Não foi possível carregar os filmes.</p>
      )}
    </div>
  )
}

export default Movies
