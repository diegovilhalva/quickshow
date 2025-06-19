import { useEffect, useState } from "react"
import axios from "axios"
import MovieCard from "../components/MovieCard"
import BlurCircle from "../components/BlurCircle"
import { API_KEY, TMDB_BASE_URL } from "../lib/constants"

const Movies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)



  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      try {
     
        const res = await axios.get(`${TMDB_BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=pt-BR&page=${page}`)
        const nowPlaying = res.data.results
        const details = await Promise.all(
          nowPlaying.map((movie) =>
            axios
              .get(`${TMDB_BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&language=pt-BR`)
              .then((res) => res.data)
          )
        )
        setMovies(details)
        setTotalPages(res.data.total_pages)
      } catch (error) {
        console.error("Erro ao buscar filmes:", error)
        setMovies([])
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
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
        <p className="text-center my-20">Carregando filmes...</p>
      ) : movies.length > 0 ? (
        <>
          <div className="flex flex-wrap max-sm:justify-center gap-8">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
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
      ) : (
        <p className="text-center my-20 text-red-400">Não foi possível carregar os filmes.</p>
      )}
    </div>
  )
}

export default Movies
