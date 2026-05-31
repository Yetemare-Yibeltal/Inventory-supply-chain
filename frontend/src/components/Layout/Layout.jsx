import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import PageTransition from '../common/PageTransition'
import Spinner from '../common/Spinner'

const Layout = () => {
  return (
    <div className='flex flex-col h-screen w-full bg-[#09090b] text-zinc-100 overflow-hidden antialiased selection:bg-indigo-500/30'>
      {/* Primary Top Header Frame Node */}
      <Header />

      <div className='flex flex-1 overflow-hidden relative w-full'>
        {/* Core Control Sidebar - Isolated to Desktop Viewports */}
        <aside className='hidden md:flex flex-col h-full shrink-0 z-20 border-r border-zinc-800/60 bg-[#0d1117]/50 backdrop-blur-sm'>
          <Sidebar />
        </aside>

        {/* Main Application Page Viewport Stream with Suspense Boundary */}
        <main className='flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 relative focus:outline-none scroll-smooth'>
          <div className='max-w-7xl mx-auto'>
            <Suspense fallback={<Spinner />}>
              <PageTransition>
                <Outlet />
              </PageTransition>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

