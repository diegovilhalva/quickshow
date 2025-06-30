import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiEndpoint } from '../lib/constants'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useLocation, useNavigate } from 'react-router'
import toast from 'react-hot-toast'

export const AppContext = createContext()


export const AppProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])

    const { user } = useUser()
    const { getToken } = useAuth()
    const location = useLocation()
    const [totalPages, setTotalPages] = useState(1)
    const navigate = useNavigate()
    const fetchIsAdmin = async () => {
        try {
            const { data } = await axios.get(`${apiEndpoint}/admin/is-admin`, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            })
            setIsAdmin(data.isAdmin)

            if (!data.isAdmin && location.pathname.startsWith("/admin")) {
                navigate("/")
                toast.error("Você não está autorizado para acessar esta página")
            }
        } catch (error) {
            console.log(error)
            if (
                error.response &&
                error.response.status === 401 &&
                location.pathname.startsWith("/admin")
            ) {
                navigate("/")
                toast.error("Acesso negado. Apenas administradores podem entrar aqui.")
            }
        }
    }


    const fetchShows = async (page = 1, limit = 8) => {
        try {
            const { data } = await axios.get(`${apiEndpoint}/show/all?page=${page}&limit=${limit}`)
            if (data.success) {
                setShows(data.shows)
                setTotalPages(data.totalPages)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }


    const fetchFavoriteMovies = async () => {
        try {
            const { data } = await axios.get(`${apiEndpoint}/user/favorites`, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            })

            if (data.success) {
                setFavoriteMovies(data.movies)
            } else {
                toast(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchShows()
    }, [])
    useEffect(() => {
        if (user) {
            fetchIsAdmin()
            fetchFavoriteMovies()
        }
    }, [user])



    const value = {
        fetchIsAdmin,
        user,
        getToken,
        navigate,
        isAdmin,
        shows,
        favoriteMovies,
        fetchFavoriteMovies,
        fetchShows,
        totalPages
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const userAppContext = () => useContext(AppContext)


