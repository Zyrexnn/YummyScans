'use client'

import { motion } from 'framer-motion'
import { BookOpen, Languages, Zap, Shield } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Koleksi Lengkap',
    desc: 'Ribuan manga, manhwa, dan manhua dari berbagai genre.',
  },
  {
    icon: Languages,
    title: 'Sub Indo Berkualitas',
    desc: 'Terjemahan bahasa Indonesia yang akurat dan mudah dipahami.',
  },
  {
    icon: Zap,
    title: 'Update Harian',
    desc: 'Chapter baru setiap hari sesuai jadwal rilis resmi.',
  },
  {
    icon: Shield,
    title: 'Tanpa Iklan',
    desc: 'Pengalaman membaca bersih tanpa iklan yang mengganggu.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="section-spacing bg-background transition-theme">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-eyebrow text-muted-foreground mb-3">Kenapa YummyScans?</div>
          <h2 className="text-display-lg">Baca Tanpa Batas</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="group relative rounded-[20px] p-6 md:p-8 bg-secondary/50 hover:bg-secondary transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-[12px] bg-background flex items-center justify-center mb-5 shadow-sm">
                  <f.icon className="w-6 h-6 text-foreground/80" />
                </div>
                <h3 className="text-headline mb-2">{f.title}</h3>
                <p className="text-body-sm text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
