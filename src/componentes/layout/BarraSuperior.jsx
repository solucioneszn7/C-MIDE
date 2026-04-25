// ===== Barra Superior — Glassmorphism Premium =====
import { useState, useEffect, useRef } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { Menu, Bell, AlertTriangle, CreditCard, Info, X, ChevronRight, Search, Sun, Moon, Plus, Sparkles } from 'lucide-react'
import { useAuth } from '../../contextos/ContextoAutenticacion'
import { escucharProyectos } from '../../servicios/proyectos'
import { generarNotificacionesPendientes } from '../../servicios/notificaciones'

const rutaNombres = {
  dashboard: 'Dashboard',
  proyectos: 'Proyectos',
  nuevo: 'Nuevo Proyecto',
  configuracion: 'Configuración',
  calendario: 'Calendario',
  planificacion: 'Planificación',
  mediciones: 'Mediciones',
  certificaciones: 'Certificaciones',
}

export default function BarraSuperior({ onAbrirMenu }) {
  const { usuario, datosUsuario, esAdmin } = useAuth()
  const navigate = useNavigate()
  const [notificaciones, setNotificaciones] = useState([])
  const [panelAbierto, setPanelAbierto] = useState(false)
  const [oscuro, setOscuro] = useState(() => document.documentElement.classList.contains('dark'))
  const panelRef = useRef(null)
  const location = useLocation()

  const segmentos = location.pathname.split('/').filter(Boolean)
  const migas = segmentos.map((seg, i) => ({
    nombre: rutaNombres[seg] || (seg.length > 12 ? seg.slice(0, 10) + '…' : seg),
    ruta: '/' + segmentos.slice(0, i + 1).join('/'),
    esUltimo: i === segmentos.length - 1,
  }))

  useEffect(() => {
    if (!usuario) return
    const cancelar = escucharProyectos(usuario.uid, esAdmin, (proyectos) => {
      const notifs = generarNotificacionesPendientes(proyectos, datosUsuario)
      setNotificaciones(notifs)
    })
    return cancelar
  }, [usuario, esAdmin, datosUsuario])

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setPanelAbierto(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleTema() {
    const next = !oscuro
    setOscuro(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('cmide-tema', next ? 'dark' : 'light')
  }

  const iconosPrioridad = {
    alta: { icono: AlertTriangle, color: 'text-red-400 bg-red-500/15 border-red-500/30' },
    media: { icono: CreditCard, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
    baja: { icono: Info, color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
  }

  const cantidadAltas = notificaciones.filter(n => n.prioridad === 'alta').length

  return (
    <header className="topbar-glass h-14 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      {/* Left: hamburger + breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onAbrirMenu}
          className="lg:hidden p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Menu className="h-4 w-4" />
        </button>

        <nav className="flex items-center gap-1.5 text-[13px] min-w-0">
          {migas.length === 0 && (
            <span className="font-semibold text-gray-900 dark:text-white/90">Inicio</span>
          )}
          {migas.map((miga, i) => (
            <div key={i} className="flex items-center gap-1.5 min-w-0">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-400 dark:text-white/30 flex-shrink-0" />}
              {miga.esUltimo ? (
                <span className="font-semibold text-gray-900 dark:text-white/90 truncate">{miga.nombre}</span>
              ) : (
                <Link
                  to={miga.ruta}
                  className="text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors truncate capitalize"
                >
                  {miga.nombre}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Center: command palette */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <button
          onClick={() => navigate('/proyectos')}
          className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg glass-soft border border-white/10 dark:border-white/[0.06] text-[12.5px] text-gray-500 dark:text-white/45 hover:bg-white/60 dark:hover:bg-white/[0.06] transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Buscar proyectos, tareas, documentos…</span>
          <kbd className="ml-auto text-[10px] bg-black/[0.04] dark:bg-white/[0.08] px-1.5 py-0.5 rounded font-mono text-gray-500 dark:text-white/50">⌘K</kbd>
        </button>
      </div>

      {/* Right: quick actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => navigate('/proyectos/nuevo')}
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium text-white bg-gradient-to-br from-violet-500 to-pink-500 shadow-md shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] transition-all"
        >
          <Plus className="h-3.5 w-3.5" /> Nuevo
        </button>

        <button
          onClick={toggleTema}
          className="p-1.5 rounded-lg text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10 transition-colors"
          title={oscuro ? 'Tema claro' : 'Tema oscuro'}
        >
          {oscuro ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setPanelAbierto(!panelAbierto)}
            className="relative p-1.5 rounded-lg text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {notificaciones.length > 0 && (
              <span className={`absolute -top-0.5 -right-0.5 h-4 min-w-[16px] rounded-full text-white text-[9.5px] font-bold flex items-center justify-center px-1 shadow ${
                cantidadAltas > 0 ? 'bg-red-500' : 'bg-violet-500'
              }`}>
                {notificaciones.length}
              </span>
            )}
          </button>

          {panelAbierto && (
            <div className="absolute right-0 top-full mt-2 w-[360px] glass-strong rounded-2xl border border-white/10 dark:border-white/[0.08] z-50 overflow-hidden animate-scale-in">
              <div className="px-4 py-3 border-b border-white/10 dark:border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-[13.5px]">Notificaciones</h3>
                </div>
                <button onClick={() => setPanelAbierto(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notificaciones.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-3">
                      <Bell className="h-5 w-5 text-violet-400" />
                    </div>
                    <p className="text-[13px] text-gray-500 dark:text-white/50">Todo en orden</p>
                    <p className="text-[11px] text-gray-400 dark:text-white/30 mt-0.5">Sin alertas pendientes</p>
                  </div>
                ) : (
                  notificaciones.map((notif, i) => {
                    const config = iconosPrioridad[notif.prioridad] || iconosPrioridad.baja
                    const Icono = config.icono
                    return (
                      <div key={i} className="px-4 py-3 border-b border-white/5 dark:border-white/[0.04] hover:bg-white/30 dark:hover:bg-white/[0.04] transition-colors cursor-default">
                        <div className="flex items-start gap-3">
                          <div className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${config.color}`}>
                            <Icono className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12.5px] text-gray-800 dark:text-white/85 leading-snug">{notif.mensaje}</p>
                            <p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5 capitalize">{notif.tipo}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-white/10 dark:border-white/[0.06]">
                <p className="text-[11px] text-gray-500 dark:text-white/40">
                  Resumen semanal · <strong className="text-gray-700 dark:text-white/70">lunes 09:00</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
