import React from 'react'
import { useNavigate } from 'react-router'
import { formatRuntime } from '../lib/functions'
import { StarIcon } from 'lucide-react'

const MovieCard = ({ movie }) => {
  const navigate = useNavigate()

  const genres = movie.genres?.slice(0, 2).map((g) => g).join(" | ")
  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66">
      <img
        onClick={() => {
          navigate(`/movies/${movie._id}`)
          scrollTo(0, 0)
        }}
        src={`https://image.tmdb.org/t/p/original${movie.backdrop}`}
        alt={movie.title}
        className="rounded-lg cursor-pointer"
      />

      <p className="font-semibold mt-2 truncate">{movie.title}</p>
      <p className="text-sm text-gray-400 mt-2">
        {new Date(movie.releaseDate).getFullYear()} • {genres} • {formatRuntime(movie.runtime)}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
          onClick={() => {
            navigate(`/movies/${movie._id}`)
            scrollTo(0, 0)
          }}
        >
          Comprar ingresso
        </button>
        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {movie.rating.toFixed(1)}
        </p>
      </div>
    </div>
  )
}

export default MovieCard
