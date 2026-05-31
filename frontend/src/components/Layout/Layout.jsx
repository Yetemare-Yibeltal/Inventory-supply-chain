import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import PageTransition from '../common/PageTransition'

const Layout = () => {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar visible on desktop only */}
        <div className='hidden md:block'>
          <Sidebar />
        </div>
        <main className='flex-1 overflow-auto bg-gray-100 p-4 md:p-6'>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  )
}

export default Layout
