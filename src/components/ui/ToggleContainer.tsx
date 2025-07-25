import {
  Sheet,
  SheetContent,
 
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import NavigationRoutes from "./NavigationRoutes"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useAuth } from "@clerk/clerk-react"
const ToggleContainer = () => {
  const { userId } = useAuth()
  return (
    <Sheet>
      <SheetTrigger className=" block md:hidden"><Menu /></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle/>
          
        </SheetHeader>
         <NavigationRoutes isMobile/>
          {userId && (
            <NavLink
              to={"/generate"} className={({ isActive }) => cn("text-base text-neutral-600 ml-10 mt-3", isActive && "text-neutral-950 font-semibold")}>
              Take an interview
            </NavLink>
          )}
      </SheetContent>
    </Sheet>
  )
}

export default ToggleContainer
