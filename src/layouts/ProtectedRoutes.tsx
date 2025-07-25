import LoaderPage from "@/Routes/LoaderPage"
import { useAuth } from "@clerk/clerk-react"
import { Navigate } from "react-router-dom"


const ProtectedRoutes = ({children}: {children : React.ReactNode}) => {
    const { isLoaded, isSignedIn } = useAuth()
    if(!isLoaded){
        return <LoaderPage />
    }
    if(!isSignedIn) {
         return <Navigate to={"/signin"}  />
    }
  return children
}

export default ProtectedRoutes
