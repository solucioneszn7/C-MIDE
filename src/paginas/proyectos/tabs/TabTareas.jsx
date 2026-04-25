// ===== Tab Tareas — Kanban Trello/Monday-style =====
import { useEffect, useMemo, useState } from 'react'
import {
  Plus, X, MoreHorizontal, Flag, User, Calendar, Trash2, GripVertical,
  Tag, Clock, AlertTriangle, CheckCircle2,
} from 'lucide-react'
import { escucharTareas, crearTarea, actualizarTarea, eliminarTarea, ESTADOS_TAREA, PRIORIDADES } from '../../../servicios/tareas'
import GlassCard from '../../../componentes/ui/GlassCard'
import toast from 'react-hot-toast'

const COLOR_COL = {
  backlog:    { dot: 'bg-slate-400',   text: 'text-slate-300',   grad: 'from-slate-500/15 to-slate-500/5' },
  pendiente:  { dot: 'bg-cyan-400',    text: 'text-cyan-300',    grad: 'from-cyan-500/20 to-sky-500/5' },
  en_curso:   { dot: 'bg-violet-400',  text: 'text-violet-300',  grad: 'from-violet-500/20 to-purple-500/5' },
  revision:   { dot: 'bg-amber-400',   text: 'text-amber-300',   grad: 'from-amber-500/20 to-orange-500/5' },
  completada: { dot: 'bg-emerald-400', text: 'text-emerald-300', grad: 'from-emerald-500/20 to-teal-500/5' },
}

const COLOR_PRI = {
  baja:    { bg: 'bg-slate-500/15',  text: 'text-slate-300',  label: '· Baja' },
  media:   { bg: 'bg-cyan-500/15',   text: 'text-cyan-300',   label: '·· Media' },
  alta:    { bg: 'bg-amber-500/15',  text: 'text-amber-300',  label: '··· Alta' },
  urgente: { bg: 'bg-rose-500/15',   text: 'text-rose-300',   label: '!! Urgente' },
}

export default function TabTareas({ proyectoId }) {
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [arrastrandoId, setArrastrandoId] = useState(null)
  const [hoverCol, setHoverCol] = useState(null)
  const [creandoEn, setCreandoEn] = useState(null)
  const [tituloRapido, setTituloRapido] = useState('')

  useEffect(() => {
    return escucharTareas(proyectoId, (d) => {
      setTareas(d)
      setCargando(false)
    })
  }, [proyectoId])

  const cols = useMemo(() => {
    const map = Object.fromEntries(ESTADOS_TAREA.map((c) => [c.key, []]))
    tareas.forEach((t) => {
      const e = t.estado || 'pendiente'
      if (map[e]) map[e].push(t)
      else map.pendiente.push(t)
    })
    return map
  }, [tareas])

  async function moverTarea(tareaId, nuevoEstado) {
    const t = tareas.find((x) => x.id === tareaId)
    if (!t || t.estado === nuevoEstado) return
    try {
      await actualizarTarea(proyectoId, tareaId, { estado: nuevoEstado })
    } catch (e) {
      console.error(e)
      toast.error('No se pudo mover')
    }
  }

  async function quickCreate(estado) {
    if (!tituloRapido.trim()) {
      setCreandoEn(null)
      setTituloRapido('')
      return
    }
    try {
      await crearTarea(proyectoId, {
        titulo: tituloRapido.trim(),
        estado,
        prioridad: 'media',
      })
      setTituloRapido('')
      toast.success('Tarea creada')
    } catch (e) {
      console.error(e)
      toast.error('No se pudo crear')
    }
  }

  async function manejarEliminar(tareaId) {
    if (!confirm('¿Eliminar esta tarea?')) return
    try {
      await eliminarTarea(proyectoId, tareaId)
      toast.success('Eliminada')
    } catch {
      toast.error('Error al eliminar')
    }
  }

  function onDragStart(e, t) {
    setArrastrandoId(t.id)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', t.id)
  }

  function onDragOver(e, colKey) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (hoverCol !== colKey) setHoverCol(colKey)
  }

  function onDrop(e, colKey) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (id) moverTarea(id, colKey)
    setHoverCol(null)
    setArrastrandoId(null)
  }

  if (cargando) return <div className="text-center py-10 text-white/40 text-sm">Cargando tareas...</div>

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-white/45">
          {tareas.length} {tareas.length === 1 ? 'tarea total' : 'tareas totales'} · arrastra para mover · click en + para crear
        </p>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 pb-3">
        <div className="flex gap-3 min-w-max">
          {ESTADOS_TAREA.map((col) => {
            const items = cols[col.key] || []
            const C = COLOR_COL[col.key]
            const isHover = hoverCol === col.key
            return (
              <div
                key={col.key}
                onDragOver={(e) => onDragOver(e, col.key)}
                onDragLeave={() => setHoverCol(null)}
                onDrop={(e) => onDrop(e, col.key)}
                className={`flex-shrink-0 w-[280px] rounded-2xl glass-soft border border-white/[0.06] flex flex-col transition-all ${isHover ? 'border-white/[0.18]' : ''}`}
                style={{ minHeight: 360 }}
              >
                <div className={`px-3.5 pt-3 pb-2.5 rounded-t-2xl bg-gradient-to-br ${C.grad}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${C.dot}`} />
                      <span className="text-[12px] font-semibold text-white">{col.label}</span>
                    </div>
                    <span className="text-[10.5px] font-bold text-white/65 bg-white/[0.06] rounded px-1.5 py-0.5">
                      {items.length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-2 space-y-1.5">
                  {items.map((t) => (
                    <TaskCard
                      key={t.id}
                      tarea={t}
                      arrastrando={arrastrandoId === t.id}
                      onDragStart={(e) => onDragStart(e, t)}
                      onDragEnd={() => { setArrastrandoId(null); setHoverCol(null) }}
                      onDelete={() => manejarEliminar(t.id)}
                      onUpdate={(d) => actualizarTarea(proyectoId, t.id, d)}
                    />
                  ))}

                  {/* Quick create */}
                  {creandoEn === col.key ? (
                    <div className="kanban-card">
                      <input
                        autoFocus
                        type="text"
                        value={tituloRapido}
                        onChange={(e) => setTituloRapido(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') quickCreate(col.key)
                          if (e.key === 'Escape') { setCreandoEn(null); setTituloRapido('') }
                        }}
                        onBlur={() => quickCreate(col.key)}
                        placeholder="Título de la tarea..."
                        className="w-full bg-transparent text-[12.5px] text-white placeholder-white/30 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => { setCreandoEn(col.key); setTituloRapido('') }}
                      className="w-full py-1.5 rounded-lg text-[11.5px] text-white/40 hover:text-white hover:bg-white/[0.04] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" /> Añadir tarea
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TaskCard({ tarea, arrastrando, onDragStart, onDragEnd, onDelete, onUpdate }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const pri = COLOR_PRI[tarea.prioridad] || COLOR_PRI.media
  const venceEn = tarea.fechaLimite ? Math.ceil((new Date(tarea.fechaLimite).getTime() - Date.now()) / 86400000) : null

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`kanban-card group relative ${arrastrando ? 'opacity-40' : ''}`}
    >
      <div className="flex items-start gap-2 mb-1.5">
        <GripVertical className="h-3 w-3 text-white/20 mt-0.5 flex-shrink-0 cursor-grab" />
        <p className="text-[12.5px] font-medium text-white leading-tight flex-1">
          {tarea.titulo}
        </p>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuAbierto(!menuAbierto) }}
            className="opacity-0 group-hover:opacity-100 p-0.5 text-white/40 hover:text-white transition-opacity"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
          {menuAbierto && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenuAbierto(false)} />
              <div className="absolute right-0 top-5 z-40 w-40 glass-strong rounded-lg border border-white/[0.08] py-1 shadow-2xl">
                {PRIORIDADES.map((p) => (
                  <button
                    key={p.key}
                    onClick={(e) => {
                      e.stopPropagation()
                      onUpdate({ prioridad: p.key })
                      setMenuAbierto(false)
                    }}
                    className="w-full text-left px-3 py-1.5 text-[11.5px] text-white/75 hover:bg-white/[0.06] flex items-center gap-2"
                  >
                    <Flag className="h-3 w-3" /> Prioridad: {p.label}
                  </button>
                ))}
                <div className="my-1 border-t border-white/[0.06]" />
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(); setMenuAbierto(false) }}
                  className="w-full text-left px-3 py-1.5 text-[11.5px] text-rose-300 hover:bg-rose-500/10 flex items-center gap-2"
                >
                  <Trash2 className="h-3 w-3" /> Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {tarea.descripcion && (
        <p className="text-[10.5px] text-white/45 line-clamp-2 mb-2 ml-5">
          {tarea.descripcion}
        </p>
      )}

      <div className="flex items-center justify-between flex-wrap gap-1 ml-5">
        <span className={`text-[9.5px] font-semibold px-1.5 py-0.5 rounded ${pri.bg} ${pri.text}`}>
          {pri.label}
        </span>
        {venceEn !== null && (
          <span className={`text-[9.5px] flex items-center gap-0.5 ${venceEn < 0 ? 'text-rose-300' : venceEn <= 3 ? 'text-amber-300' : 'text-white/45'}`}>
            <Clock className="h-2.5 w-2.5" />
            {venceEn < 0 ? `+${Math.abs(venceEn)}d` : venceEn === 0 ? 'hoy' : `${venceEn}d`}
          </span>
        )}
      </div>
    </div>
  )
}
