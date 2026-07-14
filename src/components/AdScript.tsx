'use client'

import { useEffect, useRef } from 'react'

export default function AdScript({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const existing = document.querySelector('script[src*="mountainous-statement.com"]')
    if (existing) return

    const s = document.createElement('script')
    s.src = '//mountainous-statement.com/bUXJV.sqddGblR0ZYoWWcp/he/mt9yu/ZLUolQkAPZTVcvy/MZj-EV5eM/DCE/t/NczKIbyaM/T/kpwjNiQA'
    s.async = true
    s.referrerPolicy = 'no-referrer-when-downgrade'
    document.body.appendChild(s)
  }, [])

  return <div ref={ref} className={className} />
}
