import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import BlurCircle from "./BlurCircle"
import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router"

const getNextDays = (n = 12) => {
  const days = []
  const today = new Date()
  for (let i = 1; i <= n; i++) {
    const next = new Date(today)
    next.setDate(today.getDate() + i)
    days.push(next)
  }
  return days
}

const DateSelect = ({ id }) => {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()
  const dates = getNextDays(12)

  const bookHandler = () => {
    if (!selected) return toast.error("Selecione uma data para agendar")
    navigate(`/movies/${id}/${selected}`)
    scrollTo(0, 0)
  }

  return (
    <div className="pt-30" id="dateSelect">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0px" />
        <div>
          <p className="text-lg font-semibold">Escolher Data</p>
          <div className="flex item-center gap-6 text-sm mt-5">
            <ChevronLeftIcon width={28} />
            <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
              {dates.map((date) => {
                const dateString = date.toISOString().split("T")[0]
                return (
                  <button
                    onClick={() => setSelected(dateString)}
                    key={dateString}
                    className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer ${selected === dateString ? "bg-primary text-white" : "border border-primary/70"}`}
                  >
                    <span>{date.getDate()}</span>
                    <span>{date.toLocaleDateString("pt-BR", { month: "short" })}</span>
                  </button>
                )
              })}
            </span>
            <ChevronRightIcon width={28} />
          </div>
        </div>
        <button
          className="bg-primary text-white px-8 py-3 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer"
          onClick={bookHandler}
        >
          Agendar
        </button>
      </div>
    </div>
  )
}

export default DateSelect
