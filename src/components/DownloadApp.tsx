'use client'

import { Smartphone } from 'lucide-react'

export default function DownloadApp() {
  return (
    <section className="bg-[#0a0a0b] border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Smartphone className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Download YummyScans App
              </h3>
              <p className="text-sm text-white/50 mt-1">
                Baca manga offline kapan saja, di mana saja.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black hover:bg-white/90 transition-all hover:scale-105 no-underline"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 16.435c-.525.847-1.25 1.935-2.148 2.952-.778.88-1.547 1.645-2.472 1.645-.9 0-1.213-.554-2.267-.554-1.078 0-1.406.566-2.266.566-.859 0-1.566-.69-2.32-1.528-1.355-1.503-2.512-3.968-2.512-6.417 0-2.621 1.354-4.541 3.416-4.541.82 0 1.61.354 2.16.354.527 0 1.355-.418 2.278-.418.718 0 2.418.14 3.437 1.965-.094.07-2.032 1.19-2.032 3.564 0 2.64 2.3 3.58 2.324 3.58-.011.047-.351 1.211-1.168 2.382zm-3.446-9.529c.655-.81 1.17-1.925 1.01-3.076-.949.047-2.078.645-2.734 1.445-.598.726-1.133 1.834-.972 2.914 1.043.082 2.05-.539 2.696-1.283z"/>
              </svg>
              App Store
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition-all hover:scale-105 no-underline"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.813L18.79 12.5 3.61 23.188c-.294.178-.66.194-.969.05A1.01 1.01 0 012 22.359V1.641c0-.388.217-.733.641-.878.309-.144.675-.128.969.05z"/>
              </svg>
              Google Play
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
