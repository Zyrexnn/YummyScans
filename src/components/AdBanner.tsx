'use client'

import { useEffect, useRef } from 'react'

interface AdBannerProps {
  width: number
  height: number
  adKey: string
  className?: string
}

export default function AdBanner({ width, height, adKey, className }: AdBannerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (ref.current.querySelector('iframe')) return

    const div = document.createElement('div')
    div.innerHTML = `
      <script>
        atOptions = {
          'key': '${adKey}',
          'format': 'iframe',
          'height': ${height},
          'width': ${width},
          'params': {}
        };
      </script>
      <script src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script>
    `

    const scripts = div.querySelectorAll('script')
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script')
      if (oldScript.src) {
        newScript.src = oldScript.src
        newScript.async = true
      } else {
        newScript.textContent = oldScript.textContent
      }
      ref.current!.appendChild(newScript)
    })
  }, [adKey, width, height])

  return (
    <div
      ref={ref}
      className={className}
      style={{ minWidth: `${width}px`, minHeight: `${height}px` }}
    />
  )
}
