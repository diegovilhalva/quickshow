import  { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { assets } from "../assets/assets"
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react"
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {user} = useUser()
  const {openSignIn} = useClerk()
  const navigate = useNavigate()
  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5' role="navigation">
      <Link to="/" className='max-md:flex-1'>
        <img src={assets.logo} alt="QuickShow Logo" className='w-36 h-auto' />
      </Link>
      <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3  max-md:h-screen  max-md:pb-20 min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>
        <XIcon aria-label="Fechar menu" className='md:hidden  absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />
        <Link to="/" onClick={() => {scrollTo(0,0); setIsOpen(false)} } className=''>
          Início
        </Link>
        <Link to="/movies" onClick={() => {scrollTo(0,0); setIsOpen(false)} } className=''>
          Filmes
        </Link>
        <Link to="/" onClick={() => {scrollTo(0,0); setIsOpen(false)} } className='' >
          Cinemas
        </Link>
        <Link to="/" onClick={() => {scrollTo(0,0); setIsOpen(false)} } className=''>
          Lançamentos
        </Link>
        <Link to="/favorite" onClick={() => {scrollTo(0,0); setIsOpen(false)} } className=''>
          Favoritos
        </Link>
      </div>
      <div className="flex items-center gap-8">
        <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer' />
        {!user ? (
           <button aria-label="Fazer login" className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer' onClick={openSignIn}>Login</button>
        ) : (
          <UserButton >
            <UserButton.MenuItems>
              <UserButton.Action label='Meus Ingressos' labelIcon={<TicketPlus width={15} />} onClick={() => navigate("/my-bookings")}/>
            </UserButton.MenuItems>

          </UserButton>
        )}
       
      </div>
      <MenuIcon   aria-label="Abrir menu" className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />
    </div>
  )
}

export default Navbar