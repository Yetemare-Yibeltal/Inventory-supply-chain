import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import PageTransition from '../common/PageTransition'

const Layout = () => {
  return (
    <div className='flex flex-col h-screen w-full bg-[#0d1117] overflow-hidden antialiased'>
      {/* Primary Top Header Frame Node */}
      <Header />

      <div className='flex flex-1 overflow-hidden relative w-full'>
        {/* Core Control Sidebar - Isolated to Desktop Viewports */}
        <aside className='hidden md:block h-full shrink-0 z-20 border-r border-gray-800/60'>
          <Sidebar />
        </aside>

        {/* Main Application Page Viewport Stream */}
        <main className='flex-1 overflow-y-auto bg-[#0d1117] p-4 md:p-6 relative focus:outline-none'>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  )
}

export default Layout

