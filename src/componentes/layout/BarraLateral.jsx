// ===== Barra Lateral — Glassmorphism Premium =====
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FolderKanban, Settings, LogOut, X,
  ChevronLeft, ChevronRight, Search, Sparkles,
  Users, CalendarDays, FileCheck2, Ruler,
} from 'lucide-react'
import { useAuth } from '../../contextos/ContextoAutenticacion'

function CmideLogo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#7c4dff" />
          <stop offset="50%" stopColor="#ff5a8a" />
          <stop offset="100%" stopColor="#4dc7ff" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#logoGrad)" />
      <path d="M9 11h6.5a5 5 0 015 5v0a5 5 0 01-5 5H9V11z" fill="white" opacity="0.92" />
      <circle cx="22" cy="16" r="2.6" fill="white" opacity="0.7" />
    </svg>
  )
}

function IconoGantt({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="14" height="3" rx="1" />
      <rect x="7" y="10.5" width="10" height="3" rx="1" />
      <rect x="5" y="17" width="16" height="3" rx="1" />
    </svg>
  )
}

export default function BarraLateral({ abierta, colapsado, onCerrar, onToggleColapsar }) {
  const { datosUsuario, cerrarSesion } = useAuth()
  const [favoritosAbierto, setFavoritosAbierto] = useState(true)
  const [workspaceAbierto, setWorkspaceAbierto] = useState(true)
  const [obraAbierto, setObraAbierto] = useState(true)

  const enlacesPrincipales = [
    { ruta: '/dashboard', nombre: 'Dashboard', icono: LayoutDashboard, roles: ['admin', 'gestor', 'jefe_obra', 'direccion'] },
    { ruta: '/proyectos', nombre: 'Proyectos', icono: FolderKanban, roles: ['admin', 'gestor', 'jefe_obra', 'direccion'] },
    { ruta: '/calendario', nombre: 'Calendario', icono: CalendarDays, roles: ['admin', 'gestor', 'jefe_obra', 'direccion'] },
  ]

  const enlacesObra = [
    { ruta: '/planificacion', nombre: 'Planificación BC3', icono: IconoGantt, roles: ['admin', 'gestor', 'jefe_obra'] },
    { ruta: '/mediciones', nombre: 'Mediciones', icono: Ruler, roles: ['admin', 'gestor', 'jefe_obra', 'encargado'] },
    { ruta: '/certificaciones', nombre: 'Certificaciones', icono: FileCheck2, roles: ['admin', 'gestor', 'jefe_obra', 'direccion'] },
  ]

  const enlacesConfig = [
    { ruta: '/configuracion', nombre: 'Configuración', icono: Settings, roles: ['admin', 'gestor', 'jefe_obra', 'direccion'] },
  ]

  const filtrar = (links) => links.filter(e => e.roles.includes(datosUsuario?.rol))
  const todosEnlaces = [...filtrar(enlacesPrincipales), ...filtrar(enlacesObra), ...filtrar(enlacesConfig)]

  return (
    <>
      {abierta && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={onCerrar} />}

      <aside
        className={`fixed top-0 left-0 z-50 h-full sidebar-glass flex flex-col transform transition-all duration-300 ease-out select-none lg:static lg:z-auto ${abierta ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${colapsado ? 'lg:w-[60px]' : 'lg:w-[260px]'} w-[260px]`}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-3 pt-3">
          <div className={`flex items-center h-10 ${colapsado ? 'justify-center' : 'justify-between'}`}>
            {!colapsado ? (
              <>
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <CmideLogo size={26} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-bold text-white truncate leading-tight">C-MIDE</span>
                    <span className="text-[10.5px] text-white/45 leading-tight tracking-wider uppercase">Construction OS</span>
                  </div>
                </div>
                <button onClick={onCerrar} className="lg:hidden p-1 rounded text-white/50 hover:text-white hover:bg-white/10"><X className="h-4 w-4" /></button>
                <button onClick={onToggleColapsar} className="hidden lg:flex p-1 rounded text-white/40 hover:text-white hover:bg-white/10"><ChevronLeft className="h-4 w-4" /></button>
              </>
            ) : (
              <button onClick={onToggleColapsar} className="p-1.5 rounded text-white/50 hover:text-white hover:bg-white/10"><ChevronRight className="h-4 w-4" /></button>
            )}
          </div>

          {!colapsado && (
            <div className="pt-3 pb-1">
              <button className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-white/55 hover:text-white hover:bg-white/[0.06] transition-colors text-[13px] glass-soft border border-white/[0.06]">
                <Search className="h-3.5 w-3.5 flex-shrink-0" /><span>Buscar...</span>
                <kbd className="ml-auto text-[10px] text-white/40 bg-white/[0.06] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
              </button>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 mt-1">
          {!colapsado ? (
            <>
              <SidebarSection titulo="Workspace" abierto={workspaceAbierto} onToggle={() => setWorkspaceAbierto(!workspaceAbierto)}>
                {filtrar(enlacesPrincipales).map(e => <SidebarLink key={e.ruta} enlace={e} onCerrar={onCerrar} />)}
              </SidebarSection>

              <SidebarSection titulo="Control de Obra" abierto={obraAbierto} onToggle={() => setObraAbierto(!obraAbierto)}>
                {filtrar(enlacesObra).map(e => <SidebarLink key={e.ruta} enlace={e} onCerrar={onCerrar} />)}
              </SidebarSection>

              {filtrar(enlacesConfig).length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/[0.05] space-y-0.5">
                  {filtrar(enlacesConfig).map(e => <SidebarLink key={e.ruta} enlace={e} onCerrar={onCerrar} />)}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 mt-2">
              {todosEnlaces.map(e => (
                <NavLink key={e.ruta} to={e.ruta} title={e.nombre}
                  className={({ isActive }) => `p-2 rounded-lg transition-colors ${isActive ? 'bg-white/[0.1] text-white' : 'text-white/50 hover:bg-white/[0.06] hover:text-white'}`}>
                  <e.icono className="h-4 w-4" />
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        {/* Upgrade banner (small) */}
        {!colapsado && (
          <div className="px-3 pb-2">
            <div className="relative overflow-hidden rounded-xl px-3 py-2.5 border border-white/[0.06]"
              style={{ background: 'linear-gradient(135deg, rgba(124,77,255,.18), rgba(255,90,138,.12))' }}>
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-violet-300" />
                <span className="text-[11px] font-semibold text-white/85">Premium</span>
              </div>
              <p className="text-[10.5px] text-white/55 mt-0.5 leading-tight">IA + Drive + Calendar integrados</p>
            </div>
          </div>
        )}

        {/* User */}
        <div className="flex-shrink-0 border-t border-white/[0.05]">
          {!colapsado ? (
            <div className="p-2">
              <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/[0.05] transition-colors">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 via-pink-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-[12px] font-bold text-white">{datosUsuario?.nombre?.charAt(0)?.toUpperCase() || 'U'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-medium text-white truncate leading-tight">{datosUsuario?.nombre || 'Usuario'}</p>
                  <p className="text-[10.5px] text-white/45 capitalize leading-tight">{datosUsuario?.rol || 'gestor'}</p>
                </div>
                <button onClick={cerrarSesion} className="p-1.5 rounded-md text-white/35 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Cerrar sesión">
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-3">
              <button onClick={cerrarSesion} className="p-2 rounded-md text-white/35 hover:text-red-400 hover:bg-red-500/10 transition-colors"><LogOut className="h-4 w-4" /></button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

function SidebarSection({ titulo, abierto, onToggle, children }) {
  return (
    <div className="mb-2">
      <button onClick={onToggle} className="flex items-center gap-1 w-full px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white/40 hover:text-white/70 transition-colors">
        <svg className={`h-3 w-3 transition-transform ${abierto ? '' : '-rotate-90'}`} viewBox="0 0 12 12" fill="currentColor"><path d="M4 3l4 3-4 3V3z" /></svg>
        {titulo}
      </button>
      {abierto && <div className="space-y-0.5 mt-1">{children}</div>}
    </div>
  )
}

function SidebarLink({ enlace, onCerrar }) {
  return (
    <NavLink to={enlace.ruta} onClick={onCerrar}
      className={({ isActive }) => `group relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] transition-all ${
        isActive
          ? 'bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)]'
          : 'text-white/55 hover:bg-white/[0.05] hover:text-white'
      }`}>
      {({ isActive }) => (
        <>
          {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2.5px] rounded-r bg-gradient-to-b from-violet-400 to-pink-400" />}
          <enlace.icono className="h-4 w-4 flex-shrink-0" />
          <span className="truncate flex-1">{enlace.nombre}</span>
        </>
      )}
    </NavLink>
  )
}
