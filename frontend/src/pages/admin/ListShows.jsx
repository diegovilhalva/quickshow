import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const getAllShows = async () => {
    try {

      setShows([{
        movie: dummyShowsData[0],
        showDateTime: "2025-06-30T02:30:00.0002",
        showPrice: 59,
        occupiedSeats: {
          A1: "user_1",
          B1: "user_2",
          C1: "user_3"
        }
      }]);
      setLoading(false);

    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    getAllShows();
  }, []);
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
                        <td className='p-2 min-w-45 pl-5'>{show.movie.title}</td>
                        <td className='p-2'>{new Date(show.showDateTime).toLocaleDateString()} {new Date(show.showDateTime).toLocaleTimeString("pt-BR",{
                          hour12:false,
                          hour:"2-digit",
                          minute:"2-digit"
                        })}</td>
                        <td className='p-2'>{Object.keys(show.occupiedSeats).length}</td>
                        <td className='p-2'>{currency} {Object.keys(show.occupiedSeats).length*show.showPrice}</td>
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