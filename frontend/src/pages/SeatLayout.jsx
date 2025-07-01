import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { API_KEY, apiEndpoint, TMDB_BASE_URL } from "../lib/constants"
import { ArrowRightIcon, ClockIcon } from "lucide-react"
import BlurCircle from "../components/BlurCircle"
import { assets } from "../assets/assets"
import toast from "react-hot-toast"
import { userAppContext } from "../context/AppContext"
import Loading from "../components/Loading"
const SeatLayout = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]];
  const { id, date } = useParams()
  const [show, setShow] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [occupiedSeats, setOccupiedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const navigate = useNavigate()
  const { getToken, user } = userAppContext()

  useEffect(() => {
    const getShow = async () => {

      try {
        const { data } = await axios.get(`${apiEndpoint}/show/${id}`)

        setShow({
          movie: data,
          schedule: data.dateTime
        })
      } catch (error) {
        console.log(error)
      }
    }


    getShow()
  }, [id, date])
  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast.error("Por favor, selecione o horário")
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
      return toast.error("Você pode selecionar apenas 5 lugares")
    }

    if (occupiedSeats.includes(seatId)) {
      return toast('Este lugar já está reservado')
    }
    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }
  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`
          return (
            <button key={seatId} onClick={() => handleSeatClick(seatId)} className={`h-6 w-8 rounded border border-primary/60 cursor-pointer ${selectedSeats.includes(seatId) && "bg-primary  text-white"} ${occupiedSeats.includes(seatId) && 'opacity-50'}`}>
              {seatId}
            </button>
          )
        })}
      </div>
    </div>
  )

  const getOccupiedseats = async () => {
    try {
      const { data } = await axios.get(`${apiEndpoint}/booking/seats/${selectedTime.showId}`)
      if (data.success) {
        setOccupiedSeats(data.occupiedSeats)
      } else {
        toast.error("Erro ao carregar assentos")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const bookTickects = async () => {
    try {
      if (!user) {
        return toast.error("Você precisa estar logado para prosseguir")
      }
      if (!selectedTime || !selectedSeats.length) {
        return toast.error("Por favor, selecione o horário e assento")
      }
      const { data } = await axios.post(`${apiEndpoint}/booking/create`, { showid: selectedTime.showId, selectedSeats }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })

      if (data.success) {

        window.location.href = data.url
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(() => {
    if (selectedTime) {
      getOccupiedseats()
    }
  }, [selectedTime])
  if (!show) return <Loading />
  return (
    <div className="flex flex-col md:flex-row  px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      {/* Horarios disponíveis */}
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg  py-10 h-max md:sticky md:top-30">
        <p className="text-lg font-semibold px-6 ">Horários Disponíveis</p>
        <div className="mt-5 space-y-1">
          {show.schedule[date]?.map((item) => (
            <div
              key={item.time}
              onClick={() => setSelectedTime(item)}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${selectedTime?.time === item.time ? "bg-primary text-white" : "hover:bg-primary/20"
                }`}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">{new Date(item.time).toLocaleTimeString("pt-BR", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit"
              })}</p>
            </div>
          ))}

        </div>
      </div>
      {/* Layout dos assentos */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="0" right="0" />
        <h1 className="text-2xl font-semibold mb-4">Selecione o seu lugar</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className="text-gray-400 text-sm mb-6">Tela</p>
        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8  md:gap-2 mb-6 ">{groupRows[0].map(row => renderSeats(row))}
          </div>
          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, i) => (
              <div key={i}>
                {group.map((row) => renderSeats(row))}
              </div>
            ))}
          </div>

        </div>
        <button onClick={bookTickects} className="flex items-center gap-1 mt-20 px-2 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95">
          Ir para o pagamento
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default SeatLayout