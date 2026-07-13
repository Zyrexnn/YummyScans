'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  return { count, ref }
}

function StatItem({ value, suffix = '', label, delay = 0 }: {
  value: number
  suffix?: string
  label: string
  delay?: number
}) {
  const { count, ref } = useCounter(value)

  return (
    <motion.div
      ref={ref}
      className="text-center px-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="text-display-lg text-foreground mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[12px] font-medium text-muted-foreground tracking-wide">{label}</div>
    </motion.div>
  )
}

export default function StatsSection() {
  return (
    // ponytail: values below are illustrative placeholders — wire real counts from Supabase when DB is connected
    <section className="section-spacing bg-secondary/50 transition-theme">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          <StatItem value={5000} suffix="+" label="Total Manga" delay={0} />
          <StatItem value={120} suffix="K+" label="Chapter" delay={0.1} />
          <StatItem value={13} label="Genre" delay={0.2} />
          <StatItem value={50} suffix="K+" label="Pembaca" delay={0.3} />
        </div>
      </div>
    </section>
  )
}
