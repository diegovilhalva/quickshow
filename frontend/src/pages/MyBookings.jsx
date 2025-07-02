import { useEffect, useState } from "react"
import BlurCircle from "../components/BlurCircle"
import { formatRuntime } from "../lib/functions"
import { userAppContext } from "../context/AppContext"
import axios from "axios"
import { apiEndpoint } from "../lib/constants"
import Loading from "../components/Loading"
import { Link } from "react-router"
const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { getToken, user } = userAppContext()

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get(`${apiEndpoint}/user/bookings`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })
      if (data.success) {
        setBookings(data.bookings)
      }


    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    getMyBookings()
  }, [])
  console.log(bookings)
  return !isLoading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top='100px' left="100px" />
      <div className="">
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className="text-lg font-semibold mb-4">Meus Ingressos</h1>
      {bookings.map((booking) => (
        <div key={booking.id} className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl">
          <div className="flex flex-col md:flex-row">
            <img src={`https://image.tmdb.org/t/p/original${booking.show.movie.poster}`} alt={booking.show.movie.title} className="md:max-w-45 aspect-ratio h-auto object-cover object-bottom rounded" />
            <div className="flex flex-col p-4">
              <p className="text-lg font-semibold">{booking.show.movie.title}</p>
              <p className="text-gray-400 text-sm">{formatRuntime(booking.show.movie.runtime)}</p>
              <p className="text-gray-400 text-sm mt-auto">{new Date(booking.show.showDateTime).toLocaleDateString()} : {new Date(booking.show.showDateTime).toLocaleTimeString("pt-BR", {
                hourCycle: "h24",
                timeZone: "America/Sao_paulo",
                hour: "2-digit",
                minute: "2-digit"
              })}</p>
            </div>
          </div>
          <div className="flex flex-col md:items-end md:text-right justify-between p-4">
            <div className="flex items-center gap-4">
              {booking.isPaid ? (
                <span className="text-green-500 font-medium">Pago</span>
              ) : (
                <Link to={booking.paymentLink} className="bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer">Pagar</Link>
              )}
            </div>
            <div className="text-sm">
               <p className='text-2xl font-semibold mb-3'>{currency}{booking.amount},00</p>
              <p><span className="text-gray-400">Total de ingressos:</span> {booking.bookedSeats.length}</p>
              <p><span className="text-gray-400">Números dos assentos: </span>
                {booking.bookedSeats.join(", ")}</p>
            </div>
          </div>
        </div>
      ))}
      {bookings.length === 0 && (
        <div className="flex items-center justify-center mt-30">
          <p className="text-3xl font-bold">Ainda não há ingressos</p>
        </div>
      )}
    </div>
  ) : <Loading />
}

export default MyBookings