import { useEffect, useRef } from 'react'

export default function useRevealSections(){
  const sectionRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.18 }
    )

    sectionRefs.current.forEach((section) => section && observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return sectionRefs
}