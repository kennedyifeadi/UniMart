import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import About from "../pages/About"
import Login from "../pages/Login"
import SignUp from "../pages/SignUp"
import Vendors from "../pages/Vendors"
import NotFound from "../pages/NotFound"
import BecomeAVendor from "../pages/BecomeAVendor"
import withMainLayout from '../layouts/WithMainLayout'


export const AppRoutes = () => {
  const HomeWithLayout = withMainLayout(Home);
  const AboutWithLayout = withMainLayout(About);
  const LoginWithLayout = withMainLayout(Login);
  const SignUpWithLayout = withMainLayout(SignUp);
  const VendorsWithLayout = withMainLayout(Vendors);
  const BecomeAVendorWithLayout = withMainLayout(BecomeAVendor);
  const NotFoundWithLayout = withMainLayout(NotFound);
  return (
    <>  
    <Routes>
      <Route path="/" element={<HomeWithLayout />} />
      <Route path="/about" element={<AboutWithLayout />} />
      <Route path="/login" element={<LoginWithLayout />} />
      <Route path="/signup" element={<SignUpWithLayout />} />
      <Route path="/becomeavendor" element={<BecomeAVendorWithLayout />} />
      <Route path="/vendors" element={<VendorsWithLayout />} />
      <Route path="*" element={<NotFoundWithLayout />} />
    </Routes>
    </>
  )
}
