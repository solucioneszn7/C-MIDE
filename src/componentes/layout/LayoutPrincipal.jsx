// ===== Layout Principal — Glassmorphism Premium =====
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import BarraLateral from './BarraLateral'
import BarraSuperior from './BarraSuperior'

export default function LayoutPrincipal() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false)
  const [sidebarColapsado, setSidebarColapsado] = useState(false)

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Decorative animated blobs (background atmosphere) */}
      <div
        className="bg-blob animate-float"
        style={{
          width: 520, height: 520, top: -80, left: -120,
          background: 'radial-gradient(circle, rgba(124,77,255,.55), transparent 70%)',
        }}
      />
      <div
        className="bg-blob animate-float"
        style={{
          width: 460, height: 460, bottom: -120, right: -80,
          background: 'radial-gradient(circle, rgba(255,90,138,.4), transparent 70%)',
          animationDelay: '-6s',
        }}
      />
      <div
        className="bg-blob animate-float"
        style={{
          width: 380, height: 380, top: '40%', right: '30%',
          background: 'radial-gradient(circle, rgba(77,199,255,.35), transparent 70%)',
          animationDelay: '-12s',
        }}
      />

      {/* Sidebar (glass) */}
      <BarraLateral
        abierta={sidebarAbierto}
        colapsado={sidebarColapsado}
        onCerrar={() => setSidebarAbierto(false)}
        onToggleColapsar={() => setSidebarColapsado(!sidebarColapsado)}
      />

      {/* Main content area */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden min-w-0">
        <BarraSuperior
          onAbrirMenu={() => setSidebarAbierto(true)}
          sidebarColapsado={sidebarColapsado}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-10 py-7 animate-page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
