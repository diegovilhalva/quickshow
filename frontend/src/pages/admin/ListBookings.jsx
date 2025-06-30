import { useEffect, useState } from "react";
import { dummyBookingData } from "../../assets/assets";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import axios from "axios";
import { apiEndpoint } from "../../lib/constants";
import { useAuth } from "@clerk/clerk-react";
import { userAppContext } from "../../context/AppContext";


const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const { user } = userAppContext()
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth()
  const getAllBookings = async () => {
    try {
      const res = await axios.get(`${apiEndpoint}/admin/all-bookings`, {
        headers: {
          Authorization: `${await getToken()}`
        }
      })

      if (res.data.success) {
        setBookings(res.data.bookings)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    getAllBookings();
  }, [user]);
  return !isLoading ? (
    <div>
      <Title text1="Total de" text2="Reservas" />
      <div className='max-w-4xl mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-primary/20 text-left text-white'>
              <th className='p-2 font-medium pl-5'>Nome Usuário</th>
              <th className='p-2 font-medium'>Filme</th>
              <th className='p-2 font-medium'>Data</th>
              <th className='p-2 font-medium'>Lugares</th>
              <th className='p-2 font-medium'>Valor</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light'>
            {bookings.map((item, index) => (
              <tr key={index} className='border-b border-primary/20 bg-primary/5 even:bg-primary/10'>
                <td className='p-2 min-w-45 pl-5'>{item.user.name}</td>
                <td className='p-2'>{item.show.movie.title}</td>
                <td className='p-2'>{new Date(item.show.showDateTime).toLocaleDateString()}{" "}
                  {new Date(item.show.showDateTime).toLocaleTimeString("pt-BR", { hour12: false, hour: "2-digit", minute: "2-digit" })}</td>
                <td className='p-2'>{Object.keys(item.bookedSeats).map(seat => item.bookedSeats[seat]).join(", ")}</td>
                <td className='p-2'>{currency} {item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : <Loading />
}

export default ListBookings