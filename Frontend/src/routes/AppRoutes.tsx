import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import About from "../pages/About"
import Login from "../pages/Login"
import SignUp from "../pages/SignUp"
import Vendors from "../pages/Vendors"
import NotFound from "../pages/NotFound"
import BecomeAVendor from "../pages/BecomeAVendor"

export const AppRoutes = () => {
  return (
    <>  
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/becomeavendor" element={<BecomeAVendor />} />
      <Route path="/vendors" element={<Vendors />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}
