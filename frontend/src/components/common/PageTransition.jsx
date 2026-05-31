import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const PageTransition = ({ children }) => {
  const location = useLocation()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionStage, setTransitionStage] = useState('fadeIn')

  useEffect(() => {
    setTransitionStage('fadeOut')
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setTransitionStage('fadeIn')
    }, 250) // half of total animation time

    return () => clearTimeout(timer)
  }, [location, children])

  return (
    <div
      className={`
        transition-all duration-500 ease-in-out
        ${
          transitionStage === 'fadeIn'
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2'
        }
      `}
    >
      {displayChildren}
    </div>
  )
}

export default PageTransition
