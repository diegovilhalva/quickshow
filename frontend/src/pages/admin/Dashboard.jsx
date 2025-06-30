import React, { useEffect, useState } from 'react'
import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UsersIcon } from 'lucide-react';
import { dummyDashboardData } from '../../assets/assets';
import BlurCircle from '../../components/BlurCircle';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import axios from 'axios';
import { apiEndpoint } from '../../lib/constants';
import { useAuth } from '@clerk/clerk-react';
const Dashboard = () => {
    const currency = import.meta.env.VITE_CURRENCY
    const { getToken } = useAuth()
    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        activeShows: [],
        totalUser: 0
    });
    const [loading, setLoading] = useState(true);
    const dashboardCards = [
        { title: "Total de Reservas", value: dashboardData.totalBookings || "0", icon: ChartLineIcon },
        { title: "Valor Total", value: currency + dashboardData.totalRevenue || "0", icon: CircleDollarSignIcon },
        { title: "Sessões Ativas", value: dashboardData.activeShows.length || "0", icon: PlayCircleIcon },
        { title: "Total Usuários", value: dashboardData.totalUser || "0", icon: UsersIcon },

    ]

    const fetchDashboardData = async () => {
        try {
            const res = await axios.get(`${apiEndpoint}/admin/dashboard`, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            })
            console.log(res.data)

            setDashboardData(res.data.dashboardData)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        fetchDashboardData();
    }, []);


    return !loading ? (
        <div>
            <Title text1="Painel de" text2="Controle" />
            Dashboard
            <div className="relative flex flex-wrap gap-4 mt-6">
                <BlurCircle top='-100px' left='0' />
                <div className="flex  flex-wrap gap-4 w-full">
                    {
                        dashboardCards.map((card, index) => (
                            <div key={index} className='flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full'>
                                <div>
                                    <h1 className='text-sm'>{card.title}</h1>
                                    <p className='text-xl font-medium mt-1'>{card.value}</p>
                                </div>
                                <card.icon className='w-6 h-6' />
                            </div>
                        ))
                    }
                </div>
            </div>
            <p className="mt-10 text-lg font-medium ">Em cartaz</p>
            <div className='relative flex flex-wrap gap-6 mt-4 max-w-5xl'>
                <BlurCircle top='100px' left='-10%' />
                {dashboardData.activeShows.map((show) => (
                    <div key={show._id} className='w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300'>
                        <img src={`https://image.tmdb.org/t/p/w200${show.movie.poster}`} alt={show.movie.title} className='h-60 w-full object-cover' />
                        <p className='font-medium p-2 truncate'>{show.movie.title}</p>
                        <div className='flex items-center justify-between px-2'>
                            <p className='text-lg font-medium'>{currency} {show.showPrice}</p>
                            <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
                                <StarIcon className='w-4 h-4 text-primary fill-primary' />
                                {show.movie.rating.toFixed(1)}
                            </p>
                        </div>
                        <p className='px-2 pt-2 text-sm text-gray-500'>{new Date(show.showDateTime).toLocaleDateString()} {new Date(show.showDateTime).toLocaleTimeString("pt-BR",{
                            hour12:false,
                            hour:"2-digit",
                            minute:"2-digit"
                        })}</p>
                    </div>
                ))}
            </div>
        </div>
    ) : <Loading />
}

export default Dashboard