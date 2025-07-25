import { BrowserRouter, Routes, Route } from 'react-router-dom'

import PublicLayout from './layouts/PublicLayout'
import HomePage from './Routes/HomePage'

import AuthLayout from './layouts/AuthLayout'
import SignInPage from './Routes/SignIn'
import SignUpPage from './Routes/SignUp'
import ProtectedRoutes from './layouts/ProtectedRoutes'
import MainLayout from './layouts/MainLayout'
import Generate from './components/ui/Generate'
import Dashboard from './Routes/Dashboard'
import CreateEditPage from './Routes/CreateEditPage'
import MockLoadPage from './Routes/MockLoadPage'
import MockInterviewPage from './Routes/MockInterviewPage'
import Feedback from './Routes/Feedback'
import ContactUs from './Routes/ContactUs';
import AboutUs from './Routes/AboutUs'
import Services from './Routes/Services'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="services" element={<Services />} />
        </Route>

        {/* Authentication  */}
        <Route element={<AuthLayout />}>
          <Route path="/signin/*" element={<SignInPage />} />
          <Route path="/signup/*" element={<SignUpPage />} />
        </Route>
        {/* Protected routes */}
        <Route element={<ProtectedRoutes><MainLayout /></ProtectedRoutes>}>
          <Route
            element={<Generate />} path='/generate'>
            <Route index element={<Dashboard />} />
            <Route path=":interviewId" element={<CreateEditPage />} />
            <Route path="interview/:interviewId" element={<MockLoadPage />} />
            <Route path="interview/:interviewId/start" element={<MockInterviewPage />} />
            <Route path="feedback/:interviewId" element={<Feedback />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
