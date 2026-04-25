// ===== Detalle Proyecto — Premium Tabs (Monday/Trello/Notion) =====
import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, ChevronRight, MapPin, Calendar,
  Building2, Wallet, Layers, FileCheck2, Users as UsersIcon,
  CalendarDays, ClipboardList, Folder, BarChart3, Edit2,
  ExternalLink, Sparkles,
} from 'lucide-react'
import { obtenerProyecto } from '../../servicios/proyectos'
import { obtenerMontoAcordado, obtenerPorcentajeEjecucion, formatearMontoCorto } from '../../servicios/financiero'
import { formatearFecha } from '../../utils/generadores'
import GlassCard from '../../componentes/ui/GlassCard'
import Cargando from '../../componentes/ui/Cargando'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../componentes/ui/Tabs'
import toast from 'react-hot-toast'

import TabResumen from './tabs/TabResumen'
import TabTareas from './tabs/TabTareas'
import TabTimeline from './tabs/TabTimeline'
import TabMediciones from './tabs/TabMediciones'
import TabCertificaciones from './tabs/TabCertificaciones'
import TabEquipo from './tabs/TabEquipo'
import TabDocumentos from './tabs/TabDocumentos'

const ESTADO_CFG = {
  estudio:       { label: 'En Estudio',     dot: 'bg-cyan-400',    text: 'text-cyan-300',    bg: 'bg-cyan-500/15' },
  activo:        { label: 'Activo',         dot: 'bg-violet-400',  text: 'text-violet-300',  bg: 'bg-violet-500/15' },
  ejecucion:     { label: 'En Obra',        dot: 'bg-pink-400',    text: 'text-pink-300',    bg: 'bg-pink-500/15' },
  certificacion: { label: 'Certificación',  dot: 'bg-amber-400',   text: 'text-amber-300',   bg: 'bg-amber-500/15' },
  completado:    { label: 'Completado',     dot: 'bg-emerald-400', text: 'text-emerald-300', bg: 'bg-emerald-500/15' },
  archivado:     { label: 'Archivado',      dot: 'bg-slate-400',   text: 'text-slate-300',   bg: 'bg-slate-500/15' },
}

export default function PaginaDetalleProyecto() {
  const { id } = useParams()
  const navegar = useNavigate()
  const [proyecto, setProyecto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [tab, setTab] = useState(() => sessionStorage.getItem(`cmide-tab-${id}`) || 'resumen')

  useEffect(() => {
    sessionStorage.setItem(`cmide-tab-${id}`, tab)
  }, [tab, id])

  useEffect(() => {
    cargar()
  }, [id])

  async function cargar() {
    try {
      const datos = await obtenerProyecto(id)
      setProyecto(datos)
    } catch {
      toast.error('Proyecto no encontrado')
      navegar('/proyectos')
    } finally {
      setCargando(false)
    }
  }

  const cfg = useMemo(() => ESTADO_CFG[proyecto?.estado] || ESTADO_CFG.activo, [proyecto?.estado])
  const monto = proyecto ? obtenerMontoAcordado(proyecto) : 0
  const pct = proyecto ? obtenerPorcentajeEjecucion(proyecto) : 0

  if (cargando) return <Cargando texto="Cargando proyecto..." />
  if (!proyecto) return null

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px]">
        <button
          onClick={() => navegar('/proyectos')}
          className="text-white/45 hover:text-white transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Proyectos
        </button>
        <ChevronRight className="h-3 w-3 text-white/25" />
        <span className="text-white/85 font-medium">{proyecto.numeroCaso}</span>
      </div>

      {/* ===== HERO PROYECTO ===== */}
      <GlassCard className="p-0 overflow-hidden relative">
        {/* aurora background strip */}
        <div className="h-28 relative overflow-hidden border-b border-white/[0.06]"
          style={{
            background: 'linear-gradient(135deg, rgba(124,77,255,.35) 0%, rgba(255,90,138,.25) 50%, rgba(77,199,255,.25) 100%)',
          }}
        >
          <div className="absolute -top-12 -left-12 w-56 h-56 rounded-full opacity-50 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(124,77,255,.7), transparent 70%)' }}
          />
          <div className="absolute -bottom-16 right-10 w-64 h-64 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(255,90,138,.6), transparent 70%)' }}
          />

          <div className="relative h-full flex items-center px-6">
            <div className="h-14 w-14 rounded-2xl bg-white/[0.12] backdrop-blur-md border border-white/[0.15] flex items-center justify-center shadow-xl">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 backdrop-blur text-white/85">
                  {proyecto.numeroCaso}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10.5px] font-semibold ${cfg.bg} ${cfg.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              </div>
              <h1 className="text-[26px] font-bold text-white leading-tight tracking-tight truncate drop-shadow">
                {proyecto.nombre}
              </h1>
              <p className="text-[12px] text-white/75 mt-0.5 flex items-center gap-1.5 drop-shadow">
                <MapPin className="h-3 w-3" />
                {proyecto.direccion || '—'}{proyecto.comuna && `, ${proyecto.comuna}`}
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => toast('Próximamente: edición rápida')}
                className="btn-ghost text-[12px] flex items-center gap-1.5"
              >
                <Edit2 className="h-3.5 w-3.5" /> Editar
              </button>
              {proyecto.driveFolderId && (
                <a
                  href={`https://drive.google.com/drive/folders/${proyecto.driveFolderId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-[12px] flex items-center gap-1.5"
                >
                  <Folder className="h-3.5 w-3.5" /> Drive
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.05]">
          <Stat icon={Wallet} label="Monto acordado" value={monto > 0 ? formatearMontoCorto(monto) : '—'} accent="violet" hint={proyecto.moneda || 'CLP'} />
          <Stat icon={BarChart3} label="Avance" value={`${pct}%`} accent="pink" hint={pct >= 70 ? 'Alto' : pct >= 30 ? 'Medio' : 'Bajo'} />
          <Stat icon={Layers} label="Partidas BC3" value={proyecto.presupuestoResumen?.totalPartidas || 0} accent="cyan" hint={proyecto.tienePresupuesto ? 'Cargado' : 'Pendiente'} />
          <Stat icon={Calendar} label="Creado" value={formatearFecha(proyecto.fechaCreacion) || '—'} accent="emerald" hint={proyecto.fechaActualizacion ? `act. ${formatearFecha(proyecto.fechaActualizacion)}` : ''} />
        </div>
      </GlassCard>

      {/* ===== TABS ===== */}
      <Tabs value={tab} onChange={setTab}>
        <TabsList>
          <TabsTrigger value="resumen" icon={Sparkles}>Resumen</TabsTrigger>
          <TabsTrigger value="tareas" icon={ClipboardList}>Tareas</TabsTrigger>
          <TabsTrigger value="timeline" icon={CalendarDays}>Timeline</TabsTrigger>
          <TabsTrigger value="mediciones" icon={Layers}>Mediciones</TabsTrigger>
          <TabsTrigger value="certificaciones" icon={FileCheck2}>Certificaciones</TabsTrigger>
          <TabsTrigger value="equipo" icon={UsersIcon}>Equipo</TabsTrigger>
          <TabsTrigger value="documentos" icon={Folder}>Documentos</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="resumen">
            <TabResumen proyecto={proyecto} onActualizado={cargar} />
          </TabsContent>
          <TabsContent value="tareas">
            <TabTareas proyectoId={proyecto.id} />
          </TabsContent>
          <TabsContent value="timeline">
            <TabTimeline proyecto={proyecto} />
          </TabsContent>
          <TabsContent value="mediciones">
            <TabMediciones proyecto={proyecto} />
          </TabsContent>
          <TabsContent value="certificaciones">
            <TabCertificaciones proyecto={proyecto} />
          </TabsContent>
          <TabsContent value="equipo">
            <TabEquipo proyecto={proyecto} onActualizado={cargar} />
          </TabsContent>
          <TabsContent value="documentos">
            <TabDocumentos proyecto={proyecto} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

function Stat({ icon: Icon, label, value, accent = 'violet', hint }) {
  const text = {
    violet: 'text-violet-300', pink: 'text-pink-300',
    cyan: 'text-cyan-300', emerald: 'text-emerald-300',
  }[accent]
  const grad = {
    violet: 'from-violet-500/25 to-violet-700/10',
    pink: 'from-pink-500/25 to-rose-700/10',
    cyan: 'from-cyan-500/25 to-sky-700/10',
    emerald: 'from-emerald-500/25 to-teal-700/10',
  }[accent]
  return (
    <div className="px-5 py-4 flex items-start gap-3 hover:bg-white/[0.02] transition-colors">
      <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`h-4 w-4 ${text}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.1em] text-white/40 font-semibold">{label}</p>
        <p className="text-[18px] font-bold text-white leading-tight mt-0.5">{value}</p>
        {hint && <p className="text-[10.5px] text-white/40 mt-0.5">{hint}</p>}
      </div>
    </div>
  )
}
