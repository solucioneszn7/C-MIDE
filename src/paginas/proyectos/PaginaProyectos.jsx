// ===== Página Proyectos — Kanban / Tabla / Galería Premium =====
import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus, Search, FolderKanban, ArrowRight, LayoutList, Columns3, LayoutGrid,
  Building2, MapPin, User, Calendar, Wallet, MoreHorizontal, Filter, X,
  CheckCircle2, Clock, Hammer, FileCheck2, Archive, Sparkles,
} from 'lucide-react'
import { useAuth } from '../../contextos/ContextoAutenticacion'
import { escucharProyectos, actualizarProyecto } from '../../servicios/proyectos'
import { obtenerPorcentajeEjecucion, obtenerMontoAcordado, formatearMontoCorto } from '../../servicios/financiero'
import { formatearFecha } from '../../utils/generadores'
import GlassCard from '../../componentes/ui/GlassCard'
import Cargando from '../../componentes/ui/Cargando'
import toast from 'react-hot-toast'

const COLUMNAS = [
  { key: 'estudio',       label: 'En Estudio',     icon: Clock,        accent: 'cyan',    grad: 'from-cyan-500/30 to-sky-500/10',     ring: 'shadow-[0_0_30px_-12px_rgba(77,199,255,.6)]' },
  { key: 'activo',        label: 'Activos',        icon: Sparkles,     accent: 'violet',  grad: 'from-violet-500/30 to-purple-500/10', ring: 'shadow-[0_0_30px_-12px_rgba(124,77,255,.6)]' },
  { key: 'ejecucion',     label: 'En Obra',        icon: Hammer,       accent: 'pink',    grad: 'from-pink-500/30 to-rose-500/10',    ring: 'shadow-[0_0_30px_-12px_rgba(255,90,138,.6)]' },
  { key: 'certificacion', label: 'Certificación',  icon: FileCheck2,   accent: 'amber',   grad: 'from-amber-500/30 to-orange-500/10', ring: 'shadow-[0_0_30px_-12px_rgba(245,158,11,.6)]' },
  { key: 'completado',    label: 'Completado',     icon: CheckCircle2, accent: 'emerald', grad: 'from-emerald-500/30 to-teal-500/10', ring: 'shadow-[0_0_30px_-12px_rgba(16,185,129,.6)]' },
  { key: 'archivado',     label: 'Archivado',      icon: Archive,      accent: 'slate',   grad: 'from-slate-500/20 to-slate-500/5',   ring: '' },
]

const ACCENT_TEXT = {
  cyan: 'text-cyan-300', violet: 'text-violet-300', pink: 'text-pink-300',
  amber: 'text-amber-300', emerald: 'text-emerald-300', slate: 'text-slate-300',
}
const ACCENT_DOT = {
  cyan: 'bg-cyan-400', violet: 'bg-violet-400', pink: 'bg-pink-400',
  amber: 'bg-amber-400', emerald: 'bg-emerald-400', slate: 'bg-slate-400',
}

export default function PaginaProyectos() {
  const { usuario, esAdmin } = useAuth()
  const navegar = useNavigate()
  const [proyectos, setProyectos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [vista, setVista] = useState(() => localStorage.getItem('cmide-proyectos-vista') || 'kanban')
  const [arrastrandoId, setArrastrandoId] = useState(null)
  const [hoverColumna, setHoverColumna] = useState(null)

  useEffect(() => {
    if (!usuario) return
    const cancelar = escucharProyectos(usuario.uid, esAdmin, (datos) => {
      setProyectos(datos)
      setCargando(false)
    })
    return cancelar
  }, [usuario, esAdmin])

  useEffect(() => {
    localStorage.setItem('cmide-proyectos-vista', vista)
  }, [vista])

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    if (!q) return proyectos
    return proyectos.filter((p) =>
      `${p.numeroCaso} ${p.nombre} ${p.direccion} ${p.comuna} ${p.propietario?.nombre || ''}`
        .toLowerCase()
        .includes(q)
    )
  }, [proyectos, busqueda])

  const columnas = useMemo(() => {
    const map = Object.fromEntries(COLUMNAS.map((c) => [c.key, []]))
    filtrados.forEach((p) => {
      const e = p.estado || 'activo'
      if (map[e]) map[e].push(p)
      else map.activo.push(p)
    })
    return map
  }, [filtrados])

  async function cambiarEstado(proyectoId, nuevoEstado) {
    const proyecto = proyectos.find((p) => p.id === proyectoId)
    if (!proyecto || proyecto.estado === nuevoEstado) return
    try {
      await actualizarProyecto(proyectoId, { estado: nuevoEstado })
      const colCfg = COLUMNAS.find((c) => c.key === nuevoEstado)
      toast.success(`Movido a ${colCfg?.label || nuevoEstado}`, { duration: 2000 })
    } catch (e) {
      console.error(e)
      toast.error('No se pudo actualizar el estado')
    }
  }

  function onDragStart(e, p) {
    setArrastrandoId(p.id)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', p.id)
  }

  function onDragOver(e, colKey) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (hoverColumna !== colKey) setHoverColumna(colKey)
  }

  function onDragLeave(e, colKey) {
    if (hoverColumna === colKey) setHoverColumna(null)
  }

  function onDrop(e, colKey) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (id) cambiarEstado(id, colKey)
    setHoverColumna(null)
    setArrastrandoId(null)
  }

  function onDragEnd() {
    setArrastrandoId(null)
    setHoverColumna(null)
  }

  if (cargando) return <Cargando texto="Cargando proyectos..." />

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/40 font-medium mb-1">
            Workspace
          </p>
          <h1 className="text-[28px] font-bold tracking-tight">
            <span className="text-gradient">Proyectos</span>
          </h1>
          <p className="text-[13px] text-white/50 mt-1">
            {proyectos.length} {proyectos.length === 1 ? 'proyecto' : 'proyectos'} ·{' '}
            {filtrados.length !== proyectos.length && <span className="text-violet-300">{filtrados.length} en filtro · </span>}
            arrastra las tarjetas entre columnas para cambiar estado
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Buscar proyectos…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input-premium pl-9 pr-8 w-[260px] text-[12.5px]"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-white/40 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <ViewToggle vista={vista} setVista={setVista} />

          <button
            onClick={() => navegar('/proyectos/nuevo')}
            className="btn-primary flex items-center gap-1.5 text-[12.5px]"
          >
            <Plus className="h-3.5 w-3.5" /> Nuevo
          </button>
        </div>
      </div>

      {/* Empty */}
      {filtrados.length === 0 && (
        <GlassCard className="p-16 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/30 via-pink-500/20 to-cyan-500/30 mx-auto flex items-center justify-center mb-4">
            <FolderKanban className="h-7 w-7 text-violet-200" />
          </div>
          <p className="text-[15px] font-semibold text-white mb-1">
            {busqueda ? 'Sin resultados' : 'Aún no hay proyectos'}
          </p>
          <p className="text-[12.5px] text-white/45 mb-4">
            {busqueda ? 'Prueba con otro término de búsqueda' : 'Crea tu primer proyecto para empezar'}
          </p>
          {!busqueda && (
            <button
              onClick={() => navegar('/proyectos/nuevo')}
              className="btn-primary inline-flex items-center gap-1.5 text-[12.5px]"
            >
              <Plus className="h-3.5 w-3.5" /> Crear proyecto
            </button>
          )}
        </GlassCard>
      )}

      {/* ===== KANBAN ===== */}
      {filtrados.length > 0 && vista === 'kanban' && (
        <div className="overflow-x-auto -mx-4 px-4 pb-4">
          <div className="flex gap-3 min-w-max">
            {COLUMNAS.map((col) => {
              const items = columnas[col.key] || []
              const isHover = hoverColumna === col.key
              const Icon = col.icon
              return (
                <div
                  key={col.key}
                  onDragOver={(e) => onDragOver(e, col.key)}
                  onDragLeave={(e) => onDragLeave(e, col.key)}
                  onDrop={(e) => onDrop(e, col.key)}
                  className={`flex-shrink-0 w-[300px] rounded-2xl glass-soft border border-white/[0.06] flex flex-col transition-all ${isHover ? `${col.ring} border-white/[0.18]` : ''}`}
                  style={{ minHeight: 480 }}
                >
                  {/* Column header */}
                  <div className={`relative px-3.5 pt-3 pb-2.5 rounded-t-2xl bg-gradient-to-br ${col.grad}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-6 w-6 rounded-lg bg-white/[0.08] flex items-center justify-center ${ACCENT_TEXT[col.accent]}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[12px] font-semibold text-white tracking-wide">
                          {col.label}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-white/65 bg-white/[0.06] rounded-md px-1.5 py-0.5">
                        {items.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 p-2.5 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                    {items.length === 0 && (
                      <div className="py-10 text-center text-[11.5px] text-white/30 italic">
                        Suelta aquí
                      </div>
                    )}

                    {items.map((p) => (
                      <KanbanCard
                        key={p.id}
                        proyecto={p}
                        accent={col.accent}
                        arrastrando={arrastrandoId === p.id}
                        onDragStart={(e) => onDragStart(e, p)}
                        onDragEnd={onDragEnd}
                      />
                    ))}

                    {col.key === 'estudio' && (
                      <button
                        onClick={() => navegar('/proyectos/nuevo')}
                        className="w-full py-2 rounded-xl border border-dashed border-white/[0.1] text-[12px] text-white/40 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" /> Nuevo proyecto
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ===== TABLA ===== */}
      {filtrados.length > 0 && vista === 'tabla' && (
        <GlassCard className="p-0 overflow-hidden">
          <div className="hidden sm:grid grid-cols-12 gap-2 px-5 py-3 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white/45 border-b border-white/[0.06] bg-white/[0.02]">
            <span className="col-span-4">Proyecto</span>
            <span className="col-span-2">Estado</span>
            <span className="col-span-2">Propietario</span>
            <span className="col-span-2 text-right">Monto</span>
            <span className="col-span-1">Fecha</span>
            <span className="col-span-1" />
          </div>
          <div className="divide-y divide-white/[0.04]">
            {filtrados.map((p) => {
              const monto = obtenerMontoAcordado(p)
              const pct = obtenerPorcentajeEjecucion(p)
              const cfg = COLUMNAS.find((c) => c.key === p.estado) || COLUMNAS[1]
              return (
                <Link key={p.id} to={`/proyectos/${p.id}`}>
                  <div className="group grid grid-cols-1 sm:grid-cols-12 gap-2 items-center px-5 py-3 hover:bg-white/[0.04] transition-colors cursor-pointer">
                    <div className="sm:col-span-4 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono text-violet-300 bg-violet-500/10 px-1.5 py-0.5 rounded">
                          {p.numeroCaso}
                        </span>
                      </div>
                      <h3 className="text-[13px] font-semibold text-white truncate">{p.nombre}</h3>
                      <p className="text-[11px] text-white/40 truncate flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {p.direccion}, {p.comuna}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.05]">
                        <span className={`h-1.5 w-1.5 rounded-full ${ACCENT_DOT[cfg.accent]}`} />
                        <span className={ACCENT_TEXT[cfg.accent]}>{cfg.label}</span>
                      </span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[12.5px] text-white/70 truncate block">
                        {p.propietario?.nombre || '—'}
                      </span>
                    </div>
                    <div className="sm:col-span-2 text-right">
                      {monto > 0 ? (
                        <div>
                          <span className="text-[12.5px] font-semibold text-white">
                            {formatearMontoCorto(monto)}
                          </span>
                          {pct > 0 && (
                            <div className="mt-1 flex items-center gap-1.5 justify-end">
                              <div className="w-12 bg-white/[0.06] rounded-full h-1 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${pct >= 90 ? 'bg-rose-400' : pct >= 70 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-white/40">{pct}%</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-white/25">—</span>
                      )}
                    </div>
                    <div className="sm:col-span-1">
                      <span className="text-[11px] text-white/40">{formatearFecha(p.fechaCreacion)}</span>
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <ArrowRight className="h-3.5 w-3.5 text-white/25 group-hover:text-violet-300 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </GlassCard>
      )}

      {/* ===== GALERÍA ===== */}
      {filtrados.length > 0 && vista === 'galeria' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtrados.map((p) => {
            const cfg = COLUMNAS.find((c) => c.key === p.estado) || COLUMNAS[1]
            const monto = obtenerMontoAcordado(p)
            const pct = obtenerPorcentajeEjecucion(p)
            return (
              <Link key={p.id} to={`/proyectos/${p.id}`} className="block group">
                <GlassCard className={`p-0 overflow-hidden h-full transition-all duration-300 group-hover:translate-y-[-2px] ${cfg.ring}`}>
                  <div className={`h-24 relative bg-gradient-to-br ${cfg.grad}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Building2 className={`h-9 w-9 ${ACCENT_TEXT[cfg.accent]} opacity-60`} />
                    </div>
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${ACCENT_DOT[cfg.accent]}`} />
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${ACCENT_TEXT[cfg.accent]}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <span className="absolute top-2.5 right-2.5 text-[10px] font-mono text-white/70 bg-black/30 backdrop-blur px-1.5 py-0.5 rounded">
                      {p.numeroCaso}
                    </span>
                  </div>
                  <div className="p-3.5">
                    <h3 className="text-[13.5px] font-semibold text-white truncate mb-1">
                      {p.nombre}
                    </h3>
                    <p className="text-[11px] text-white/40 truncate flex items-center gap-1 mb-2.5">
                      <MapPin className="h-3 w-3" /> {p.comuna || p.direccion || '—'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="h-5 w-5 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                          <span className="text-[9px] font-bold text-white">
                            {p.propietario?.nombre?.charAt(0) || 'C'}
                          </span>
                        </div>
                        <span className="text-[10.5px] text-white/50 truncate max-w-[100px]">
                          {p.propietario?.nombre || 'Cliente'}
                        </span>
                      </div>
                      {monto > 0 ? (
                        <span className="text-[11px] font-bold text-white">{formatearMontoCorto(monto)}</span>
                      ) : (
                        <span className="text-[10px] text-white/30">Sin BC3</span>
                      )}
                    </div>
                    {pct > 0 && (
                      <div className="mt-2.5">
                        <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
                          <span>Avance</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="w-full bg-white/[0.06] rounded-full h-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct >= 90 ? 'bg-rose-400' : pct >= 70 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ============================================================ */

function ViewToggle({ vista, setVista }) {
  const items = [
    { key: 'kanban', icon: Columns3, label: 'Kanban' },
    { key: 'tabla', icon: LayoutList, label: 'Tabla' },
    { key: 'galeria', icon: LayoutGrid, label: 'Galería' },
  ]
  return (
    <div className="flex items-center gap-0.5 glass-soft rounded-lg p-0.5 border border-white/[0.06]">
      {items.map(({ key, icon: I, label }) => (
        <button
          key={key}
          onClick={() => setVista(key)}
          title={label}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors text-[11.5px] font-medium ${
            vista === key
              ? 'bg-white/[0.1] text-white shadow-inner'
              : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <I className="h-3.5 w-3.5" />
          <span className="hidden md:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}

function KanbanCard({ proyecto: p, accent, arrastrando, onDragStart, onDragEnd }) {
  const monto = obtenerMontoAcordado(p)
  const pct = obtenerPorcentajeEjecucion(p)
  const navegar = useNavigate()

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => navegar(`/proyectos/${p.id}`)}
      className={`kanban-card group cursor-pointer ${arrastrando ? 'opacity-40 rotate-1' : ''}`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] ${ACCENT_TEXT[accent]}`}>
          {p.numeroCaso}
        </span>
        <button
          onClick={(e) => { e.stopPropagation() }}
          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>

      <h4 className="text-[12.5px] font-semibold text-white leading-tight mb-1.5 line-clamp-2">
        {p.nombre}
      </h4>

      {(p.comuna || p.direccion) && (
        <p className="text-[10.5px] text-white/45 truncate flex items-center gap-1 mb-2">
          <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
          {p.comuna || p.direccion}
        </p>
      )}

      {pct > 0 && (
        <div className="mb-2">
          <div className="w-full bg-white/[0.05] rounded-full h-1 overflow-hidden">
            <div
              className={`h-full rounded-full ${pct >= 90 ? 'bg-rose-400' : pct >= 70 ? 'bg-amber-400' : 'bg-emerald-400'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.04]">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="h-4 w-4 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <span className="text-[8px] font-bold text-white">
              {p.propietario?.nombre?.charAt(0) || 'C'}
            </span>
          </div>
          <span className="text-[10px] text-white/45 truncate">
            {p.propietario?.nombre?.split(' ')[0] || 'Cliente'}
          </span>
        </div>
        {monto > 0 && (
          <span className="text-[10.5px] font-semibold text-white/85 flex items-center gap-0.5">
            <Wallet className="h-2.5 w-2.5 text-white/40" />
            {formatearMontoCorto(monto)}
          </span>
        )}
      </div>
    </div>
  )
}
