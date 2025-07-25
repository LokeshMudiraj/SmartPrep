import Footer from "@/components/ui/footer"
import Header from "@/components/ui/header"
import AuthHandler from "@/handlers/AuthHandler"
import { Outlet } from "react-router-dom"

const PublicLayout = () => {
  return (
    <div className="w-full h-screen">
      <AuthHandler />
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default PublicLayout

