import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import axios from "axios"
import { apiEndpoint } from '../../lib/constants';
const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const getAllShows = async () => {
    try {

      const res = await axios.get(`${apiEndpoint}/show/all`)
      setShows(res.data.shows)
      setLoading(false);

    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    getAllShows();
  }, []);
  console.log(shows)
  return !loading ? (
    <div>
      <Title text1="Total de" text2="Sessões" />
      <div className='max-w-4xl mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-primary/20 text-left text-white'>
              <th className='p-2 font-medium pl-5'>Filme</th>
              <th className='p-2 font-medium'>Data</th>
              <th className='p-2 font-medium'>Total Reservas</th>
              <th className='p-2 font-medium'>valor total</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light'>
             {shows.map((show,index)=>(
                    <tr key={index} className='border-b border-primary/10 bg-primary/5 even:bg-primary/10'>
                        <td className='p-2 min-w-45 pl-5'>{show.movie?.title}</td>
                        <td className='p-2'>{new Date(show.showDateTime).toLocaleDateString()} {new Date(show.showDateTime).toLocaleTimeString("pt-BR",{
                          hour12:false,
                          hour:"2-digit",
                          minute:"2-digit"
                        })}</td>
                        <td className='p-2'>{show.seatsBooked}</td>
                        <td className='p-2'>{currency} {Object.keys(show.seatsBooked).length*show.showPrice}</td>
                    </tr>
                )

                )}
          </tbody>
        </table>
      </div>
    </div>
  ) : <Loading />
}

export default ListShows