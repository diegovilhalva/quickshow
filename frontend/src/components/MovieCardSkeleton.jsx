
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const MovieCardSkeleton = () => {
  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl w-66">
      <Skeleton height={120} className="rounded-lg" />
      <Skeleton height={20} width={`80%`} className="mt-2" />
      <Skeleton height={16} width={`100%`} className="mt-2" />
      <div className="flex items-center justify-between mt-4 pb-3">
        <Skeleton height={32} width={100} borderRadius={999} />
        <Skeleton height={20} width={40} />
      </div>
    </div>
  )
}

export default MovieCardSkeleton
