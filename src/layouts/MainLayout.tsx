import Container from "@/components/ui/container"
import Footer from "@/components/ui/footer"
import Header from "@/components/ui/header"
import { Outlet } from "react-router-dom"

const MainLayout = () => {
    return (
        <div className="flex flex-col h-screen min-h-11/12">
            <Header />
            <Container className="flex-grow" >
            <main className="flex-grow min-h-11/12">
                <Outlet/>
            </main>
            </Container>
            <Footer />
        </div>
    )
}

export default MainLayout
