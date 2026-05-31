import React from 'react'

const Spinner = () => {
  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center bg-[#0d1117] relative overflow-hidden'>
      {/* Cinematic Ambient Backdrop Lens Flare */}
      <div className='absolute w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[100px] animate-pulse pointer-events-none' />

      <div className='flex flex-col items-center gap-4 relative z-10'>
        {/* Advanced Interactive Dual-Ring Spin Matrix */}
        <div className='relative w-12 h-12 flex items-center justify-center'>
          <div className='absolute inset-0 border-4 border-indigo-500/10 rounded-full' />
          <div className='absolute inset-0 border-4 border-transparent border-t-indigo-500 border-b-purple-500 rounded-full animate-spin' />
        </div>

        {/* Technical Registry Synchronization Label */}
        <div className='flex flex-col items-center gap-1'>
          <span className='text-xs font-bold tracking-widest text-gray-400 uppercase font-sans animate-pulse'>
            Syncing System Nodes
          </span>
          <span className='text-[10px] text-gray-600 font-mono tracking-tight'>
            Resolving secure token environment state...
          </span>
        </div>
      </div>
    </div>
  )
}

export default Spinner

// ==========================================
// GIT ATOMIC COMMIT TERMINAL COMMAND:
// git add src/components/common/Spinner.jsx && git commit -m "feat(ui): relocate loading spinner matrix to the global common directory layout"
// ==========================================
