import AllVendors from "../components/vendor/AllVendors"
import { LandingPage } from "../components/vendor/LandingPage"

const Vendors = () => {
  return (
    <div className="flex flex-col w-full h-max relative">
      {/* landing section */}
      <LandingPage />
      {/* vendors listing section */}
      <div>
        <AllVendors />
      </div>
    </div>
  )
}

export default Vendors
