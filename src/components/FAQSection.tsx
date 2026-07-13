'use client'

import { motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { HelpCircle } from 'lucide-react'

const faqs = [
  {
    q: 'Apakah YummyScans gratis?',
    a: 'Ya! Semua manga di YummyScans bisa dibaca secara gratis tanpa biaya berlangganan.',
  },
  {
    q: 'Apakah ada iklan yang mengganggu?',
    a: 'Tidak. Kami berkomitmen memberikan pengalaman membaca tanpa iklan yang mengganggu.',
  },
  {
    q: 'Seberapa sering manga di-update?',
    a: 'Chapter baru ditambahkan setiap hari sesuai jadwal rilis dari masing-masing manga.',
  },
  {
    q: 'Bisa request manga tertentu?',
    a: 'Bisa! Kamu bisa mengirimkan request melalui halaman kontak dan kami akan berusaha memenuhinya.',
  },
  {
    q: 'Apakah tersedia aplikasi mobile?',
    a: 'Saat ini YummyScans bisa diakses melalui browser. Aplikasi mobile sedang dalam tahap pengembangan.',
  },
]

export default function FAQSection() {
  return (
    <section className="section-spacing bg-secondary/30 transition-theme">
      <div className="max-w-[720px] mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 text-eyebrow text-muted-foreground mb-3">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </div>
          <h2 className="text-display-lg mb-4">Pertanyaan Umum</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border/50">
                <AccordionTrigger className="text-left text-[15px] font-semibold py-5 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[14px] text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
