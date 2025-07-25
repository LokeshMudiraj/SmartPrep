import { cn } from "@/lib/utils"
import { useAuth } from "@clerk/clerk-react"
import Container from "./container"
import LogoContainer from "./LogoContainer"
import NavigationRoutes from "./NavigationRoutes"
import { NavLink } from "react-router-dom"
import ProfileContainer from "./ProfileContainer"
import ToggleContainer from "./ToggleContainer"

const Header = () => {
  const { userId } = useAuth()
  return <header className={cn("w-full border-b duration-150 transition-all ease-in-out")}>
    <Container>
      <div className="flex items-center  w-full">

        <LogoContainer />
        <nav className="hidden md:flex items-center gap-5 px-5">
          <NavigationRoutes />
          {userId && (
            <NavLink
              to={"/generate"} className={({ isActive }) => cn("text-base text-neutral-600", isActive && "text-neutral-950 font-semibold")}>
              Take an interview
            </NavLink>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-6">
          <ProfileContainer />
          <ToggleContainer />
        </div>
      </div>
    </Container>
  </header>
}

export default Header
