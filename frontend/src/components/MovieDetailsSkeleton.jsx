import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

const MovieDetailsSkeleton = () => {
  return (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <Skeleton height={416} width={280} className="rounded-xl" />
        <div className="flex flex-col gap-4 flex-1">
          <Skeleton width={120} height={20} />
          <Skeleton width={300} height={40} />
          <Skeleton width={60} height={20} />
          <Skeleton count={3} height={14} width="100%" />
          <Skeleton width={250} height={20} />
          <div className="flex gap-4 mt-4">
            <Skeleton width={140} height={40} />
            <Skeleton width={140} height={40} />
            <Skeleton circle width={40} height={40} />
          </div>
        </div>
      </div>
      <p className="text-lg font-mediun mt-20">Elenco</p>
      <div className="flex gap-4 mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} circle height={100} width={100} />
        ))}
      </div>
    </div>
  )
}
export default MovieDetailsSkeleton
