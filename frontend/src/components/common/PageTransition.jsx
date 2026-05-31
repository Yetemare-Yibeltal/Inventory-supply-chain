import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const PageTransition = ({ children }) => {
  const location = useLocation()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionStage, setTransitionStage] = useState('fadeIn')

  useEffect(() => {
    // Initiate cross-fade stage down sequence
    setTransitionStage('fadeOut')

    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setTransitionStage('fadeIn')
    }, 250) // Synchronized with half of total Tailwind animation timing window

    return () => clearTimeout(timer)
  }, [location, children])

  return (
    <div
      className={`
        transition-all duration-500 ease-in-out transform-gpu
        ${
          transitionStage === 'fadeIn'
            ? 'opacity-100 translate-y-0 filter blur-0'
            : 'opacity-0 -translate-y-2 filter blur-sm'
        }
      `}
    >
      {displayChildren}
    </div>
  )
}

export default PageTransition


