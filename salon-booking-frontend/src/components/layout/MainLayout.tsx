import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 w-full">
        <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
