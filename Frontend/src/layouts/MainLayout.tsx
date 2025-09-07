import { Footer } from "../components/footer/Footer"
import { NavBar } from "../components/nav/NavBar"

const MainLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="font-roboto flex flex-col min-h-screen">
        <NavBar />
      <div>
        {children}
      </div>
      <Footer />
    </div>
  )
}

const withMainLayout = (Component: React.ComponentType) => {
  return (props: any) => (
    <MainLayout>
      <Component {...props} />
    </MainLayout>
  )
}

export default withMainLayout
