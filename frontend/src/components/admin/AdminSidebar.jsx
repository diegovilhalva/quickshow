import { LayoutDashboardIcon, ListCheckIcon, ListIcon, PlusSquareIcon } from "lucide-react"
import { assets } from "../../assets/assets"
import { NavLink } from "react-router"


const AdminSidebar = () => {
    const user = {
        firstName: 'Admin',
        lastName: 'User',
        imageUrl: assets.profile
    }

    const adminNavLinks = [
        {
            name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon
        },
        {
            name: 'Adicionar Sessão', path: '/admin/add-shows', icon: PlusSquareIcon
        },
        {
            name: 'Sessões', path: '/admin/list-shows', icon: ListIcon
        },
        {
            name: 'Ingressos', path: '/admin/list-bookings', icon: ListCheckIcon
        }
    ]


    return (
        <div className="h-[calc(100vh - 64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
            <img src={user.imageUrl} className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto" alt="user profile picture" />
            <p className="mt-2 text-base max-md:hidden">{user.firstName} {user.lastName}</p>
            <div className="w-full">
                {adminNavLinks.map((link, i) => (
                    <NavLink key={i} to={link.path} end className={({ isActive }) => `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 first:mt-6 text-gray-400 ${isActive && 'bg-primary/15 text-primary group'}`} >
                        {({ isActive }) => (
                            <>
                                <link.icon className="w-5 h-5" />
                                <p className="max-md:hidden">{link.name}</p>
                               <span className={`w-1.5 h-10 rounded-l right-0 0 a absolute ${isActive && 'bg-primary'}`}></span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default AdminSidebar