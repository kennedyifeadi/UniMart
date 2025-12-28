import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import About from "../pages/About"
import Login from "../pages/Login"
import SignUp from "../pages/SignUp"
import Vendors from "../pages/Vendors"
import NotFound from "../pages/NotFound"
import BecomeAVendor from "../pages/BecomeAVendor"
import Artisan from '../features/artisan/artisan'
import withMainLayout from '../layouts/WithMainLayout'
import VendorDashboard from '../pages/vendor/Dashboard'
import EditVendorProfile from '../features/vendor/pages/EditVendorProfile'
import VendorRoute from './VendorRoute'
import UserDashboard from '../features/dashboard/UserDashboard'
import ProtectedRoute from './ProtectedRoute'


export const AppRoutes = () => {
  const HomeWithLayout = withMainLayout(Home);
  const AboutWithLayout = withMainLayout(About);
  // const LoginWithLayout = withMainLayout(Login);
  // const SignUpWithLayout = withMainLayout(SignUp);
  const VendorsWithLayout = withMainLayout(Vendors);
  const ArtisanWithLayout = withMainLayout(Artisan);
  const BecomeAVendorWithLayout = withMainLayout(BecomeAVendor);
  const VendorDashboardWithLayout = withMainLayout(VendorDashboard);
  const EditVendorProfileWithLayout = withMainLayout(EditVendorProfile);
  const UserDashboardWithLayout = withMainLayout(UserDashboard);
  const NotFoundWithLayout = withMainLayout(NotFound);
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeWithLayout />} />
        <Route path="/about" element={<AboutWithLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/becomeavendor" element={<BecomeAVendorWithLayout />} />
        <Route path="/vendors" element={<VendorsWithLayout />} />
        <Route path="/vendors/:id" element={<ArtisanWithLayout />} />
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboardWithLayout /></ProtectedRoute>} />
        <Route path="/vendor/dashboard" element={<VendorRoute><VendorDashboardWithLayout /></VendorRoute>} />
        <Route path="/vendor/settings" element={<VendorRoute><EditVendorProfileWithLayout /></VendorRoute>} />
        <Route path="*" element={<NotFoundWithLayout />} />
      </Routes>
    </>
  )
}
