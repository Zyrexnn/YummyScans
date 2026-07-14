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
    ref.current.innerHTML = ''

    const config = document.createElement('script')
    config.textContent = `atOptions = { 'key': '${adKey}', 'format': 'iframe', 'height': ${height}, 'width': ${width}, 'params': {} };`

    const invoke = document.createElement('script')
    invoke.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`
    invoke.async = true

    const wrapper = document.createElement('div')
    wrapper.appendChild(config)
    wrapper.appendChild(invoke)
    ref.current.appendChild(wrapper)
  }, [adKey, width, height])

  return <div ref={ref} className={className} />
}
