import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from '../common/WhatsAppButton'

export default function Layout() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}


