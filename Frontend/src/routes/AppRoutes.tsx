import { Suspense, lazy } from 'react'
import { Route, Routes } from "react-router-dom"
import Login from "../pages/Login"
import SignUp from "../pages/SignUp"
import TermsOfService from "../pages/legal/TermsOfService"
import PrivacyPolicy from "../pages/legal/PrivacyPolicy"
import CookiePolicy from "../pages/legal/CookiePolicy"
import withMainLayout from '../layouts/WithMainLayout'
import VendorRoute from './VendorRoute'
import ProtectedRoute from './ProtectedRoute'
import { Loader } from '../components/loader/Loaders'

const Home = lazy(() => import('../pages/Home'))
const About = lazy(() => import('../pages/About'))
const Vendors = lazy(() => import('../pages/Vendors'))
const Artisan = lazy(() => import('../features/artisan/Artisans'))
const BecomeAVendor = lazy(() => import('../pages/BecomeAVendor'))
const VendorDashboard = lazy(() => import('../pages/vendor/Dashboard'))
const EditVendorProfile = lazy(() => import('../features/vendor/pages/EditVendorProfile'))
const UserDashboard = lazy(() => import('../features/dashboard/UserDashboard'))
const NotFound = lazy(() => import('../pages/NotFound'))


export const AppRoutes = () => {
  const HomeWithLayout = withMainLayout(Home);
  const AboutWithLayout = withMainLayout(About);
  // const LoginWithLayout = withMainLayout(Login);
  // const SignUpWithLayout = withMainLayout(SignUp);
  const VendorsWithLayout = withMainLayout(Vendors);
  const ArtisanWithLayout = withMainLayout(Artisan);
  const BecomeAVendorWithLayout = withMainLayout(BecomeAVendor);
  const TermsWithLayout = withMainLayout(TermsOfService)
  const PrivacyWithLayout = withMainLayout(PrivacyPolicy)
  const CookieWithLayout = withMainLayout(CookiePolicy)
  const VendorDashboardWithLayout = withMainLayout(VendorDashboard);
  const EditVendorProfileWithLayout = withMainLayout(EditVendorProfile);
  const UserDashboardWithLayout = withMainLayout(UserDashboard);
  const NotFoundWithLayout = withMainLayout(NotFound);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader /></div>}>
      <Routes>
        <Route path="/" element={<HomeWithLayout />} />
        <Route path="/about" element={<AboutWithLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/becomeavendor" element={<BecomeAVendorWithLayout />} />
        <Route path="/vendors" element={<VendorsWithLayout />} />
        <Route path="/vendors/:id" element={<ArtisanWithLayout />} />
        <Route path="/terms" element={<TermsWithLayout />} />
        <Route path="/privacy" element={<PrivacyWithLayout />} />
        <Route path="/cookies" element={<CookieWithLayout />} />
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboardWithLayout /></ProtectedRoute>} />
        <Route path="/vendor/dashboard" element={<VendorRoute><VendorDashboardWithLayout /></VendorRoute>} />
        <Route path="/vendor/settings" element={<VendorRoute><EditVendorProfileWithLayout /></VendorRoute>} />
        <Route path="*" element={<NotFoundWithLayout />} />
      </Routes>
    </Suspense>
  )
}
