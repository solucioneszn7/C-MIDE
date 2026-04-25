// ===== Dashboard Premium — Glassmorphism Construction OS =====
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FolderKanban, Plus, ArrowRight, Sparkles, TrendingUp,
  CheckCircle2, AlertTriangle, Activity, Zap, ChevronRight,
  Building2, Wallet, Hammer, Calendar as CalIcon, Layers,
  Search, ListChecks, Flame,
} from 'lucide-react'
import { useAuth } from '../../contextos/ContextoAutenticacion'
import { escucharProyectos } from '../../servicios/proyectos'
import KPICard from '../../componentes/ui/KPICard'
import GlassCard from '../../componentes/ui/GlassCard'
import Cargando from '../../componentes/ui/Cargando'

const MONEDA_SYM = { CLP: '$', EUR: '€', USD: '$', CAD: 'C$' }

function formatMoney(n, moneda = 'CLP') {
  if (!n || isNaN(n)) return '—'
  const sym = MONEDA_SYM[moneda] || '$'
  if (n >= 1e9) return `${sym}${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `${sym}${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${sym}${(n / 1e3).toFixed(0)}K`
  return `${sym}${n.toFixed(0)}`
}

function timeAgo(date) {
  if (!date) return '—'
  const d = date?.toDate?.() || new Date(date)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60) return 'ahora'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
  if (diff < 86400 * 7) return `hace ${Math.floor(diff / 86400)}d`
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

const ESTADO_CFG = {
  activo: { label: 'Activo', bg: 'bg-emerald-500/15', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  estudio: { label: 'En Estudio', bg: 'bg-cyan-500/15', text: 'text-cyan-300', dot: 'bg-cyan-400' },
  ejecucion: { label: 'En Obra', bg: 'bg-violet-500/15', text: 'text-violet-300', dot: 'bg-violet-400' },
  certificacion: { label: 'Certificación', bg: 'bg-amber-500/15', text: 'text-amber-300', dot: 'bg-amber-400' },
  completado: { label: 'Completado', bg: 'bg-slate-500/15', text: 'text-slate-300', dot: 'bg-slate-400' },
}

export default function PaginaDashboard() {
  const { usuario, datosUsuario, esAdmin } = useAuth()
  const navegar = useNavigate()
  const [proyectos, setProyectos] = useState([])
  const [cargando, setCargando] = useState(true)

  const hoy = new Date()
  const horas = hoy.getHours()
  const saludo = horas < 12 ? 'Buenos días' : horas < 19 ? 'Buenas tardes' : 'Buenas noches'

  useEffect(() => {
    if (!usuario) return
    return escucharProyectos(usuario.uid, esAdmin, (d) => {
      setProyectos(d)
      setCargando(false)
    })
  }, [usuario, esAdmin])

  const stats = useMemo(() => {
    const total = proyectos.length
    const conPres = proyectos.filter((p) => p.tienePresupuesto).length
    const activos = proyectos.filter((p) => p.estado === 'activo' || p.estado === 'ejecucion').length
    const enEstudio = proyectos.filter((p) => p.estado === 'estudio').length
    const completados = proyectos.filter((p) => p.estado === 'completado').length
    const sinPres = total - conPres

    const totalPresup = proyectos.reduce((acc, p) => {
      const v = p.presupuestoResumen?.presupuestoTotal || 0
      return acc + v
    }, 0)

    // crecimiento últimos 7 días
    const ahora = Date.now()
    const sieteDias = ahora - 7 * 24 * 3600 * 1000
    const recientes = proyectos.filter((p) => {
      const f = p.fechaCreacion?.toMillis?.() || 0
      return f > sieteDias
    }).length

    // sparkline (proyectos por semana, últimas 8 semanas)
    const semanas = Array(8).fill(0)
    proyectos.forEach((p) => {
      const f = p.fechaCreacion?.toMillis?.() || 0
      const sem = Math.floor((ahora - f) / (7 * 24 * 3600 * 1000))
      if (sem >= 0 && sem < 8) semanas[7 - sem]++
    })

    return { total, conPres, activos, enEstudio, completados, sinPres, totalPresup, recientes, semanas }
  }, [proyectos])

  const kanbanLite = useMemo(() => {
    const cols = {
      estudio: [],
      activo: [],
      ejecucion: [],
      certificacion: [],
      completado: [],
    }
    proyectos.forEach((p) => {
      const e = p.estado || 'activo'
      ;(cols[e] || cols.activo).push(p)
    })
    return cols
  }, [proyectos])

  if (cargando) return <Cargando texto="Cargando workspace..." />

  return (
    <div className="space-y-7">
      {/* ===== HERO ===== */}
      <section className="flex items-end justify-between gap-6 flex-wrap">
        <div className="space-y-1.5">
          <p className="text-[12px] uppercase tracking-[0.18em] text-white/40 font-medium">
            {hoy.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-[34px] sm:text-[40px] font-bold leading-[1.05] tracking-tight">
            <span className="text-gradient">{saludo}, {datosUsuario?.nombre?.split(' ')[0] || 'Equipo'}.</span>
          </h1>
          <p className="text-[14px] text-white/55 max-w-xl leading-relaxed">
            {stats.total > 0
              ? <>Tienes <strong className="text-white/85">{stats.activos} {stats.activos === 1 ? 'obra activa' : 'obras activas'}</strong>{stats.enEstudio > 0 && <> y <strong className="text-white/85">{stats.enEstudio}</strong> en estudio</>}. Vamos al control de obra.</>
              : <>Comienza creando tu primer proyecto. C-MIDE te acompaña desde el estudio hasta la certificación.</>
            }
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navegar('/proyectos')}
            className="btn-ghost flex items-center gap-1.5 text-[12.5px]"
          >
            <Search className="h-3.5 w-3.5" /> Explorar
          </button>
          <button
            onClick={() => navegar('/proyectos/nuevo')}
            className="btn-primary flex items-center gap-1.5 text-[12.5px]"
          >
            <Plus className="h-3.5 w-3.5" /> Nuevo proyecto
          </button>
        </div>
      </section>

      {/* ===== KPIs ===== */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KPICard
          label="Proyectos totales"
          value={stats.total}
          icon={FolderKanban}
          variant="violet"
          hint={stats.recientes > 0 ? `+${stats.recientes} esta semana` : 'Sin nuevos'}
          onClick={() => navegar('/proyectos')}
          sparkline={stats.semanas.map((v, i) => v + i * 0.4)}
        />
        <KPICard
          label="En ejecución"
          value={stats.activos}
          icon={Hammer}
          variant="pink"
          hint={`${stats.total > 0 ? Math.round((stats.activos / stats.total) * 100) : 0}% del portfolio`}
          onClick={() => navegar('/proyectos')}
        />
        <KPICard
          label="Presupuestado"
          value={formatMoney(stats.totalPresup)}
          icon={Wallet}
          variant="cyan"
          hint={`${stats.conPres} proyectos con BC3`}
          onClick={() => navegar('/planificacion')}
        />
        <KPICard
          label="Sin BC3"
          value={stats.sinPres}
          icon={AlertTriangle}
          variant={stats.sinPres > 0 ? 'amber' : 'emerald'}
          hint={stats.sinPres > 0 ? 'Subir presupuesto' : 'Todo cubierto'}
          onClick={() => navegar('/planificacion')}
        />
      </section>

      {/* ===== LIVE BOARD + ACTIVITY ===== */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Mini Kanban Live */}
        <GlassCard className="xl:col-span-2 p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500/30 to-pink-500/30 flex items-center justify-center">
                <Activity className="h-3.5 w-3.5 text-violet-300" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-white">Pipeline de obras</h3>
                <p className="text-[10.5px] text-white/40">Vista resumen — abre Kanban para gestionar</p>
              </div>
            </div>
            <Link
              to="/proyectos"
              className="text-[11.5px] text-violet-300 hover:text-violet-200 font-medium flex items-center gap-1"
            >
              Ver Kanban completo <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="p-4 grid grid-cols-2 md:grid-cols-5 gap-2.5">
            {Object.entries(ESTADO_CFG).map(([key, cfg]) => {
              const items = kanbanLite[key] || []
              return (
                <div key={key} className="glass-soft rounded-xl p-2.5 min-h-[160px] flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      <span className="text-[10.5px] font-semibold uppercase tracking-wider text-white/65">
                        {cfg.label}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text}`}>
                      {items.length}
                    </span>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    {items.slice(0, 3).map((p) => (
                      <Link
                        key={p.id}
                        to={`/proyectos/${p.id}`}
                        className="block kanban-card group"
                      >
                        <p className="text-[11.5px] text-white/85 font-medium truncate leading-tight">
                          {p.nombre}
                        </p>
                        <p className="text-[9.5px] font-mono text-white/40 mt-0.5 truncate">
                          {p.numeroCaso}
                        </p>
                      </Link>
                    ))}
                    {items.length === 0 && (
                      <p className="text-[10.5px] text-white/25 text-center py-4">vacío</p>
                    )}
                    {items.length > 3 && (
                      <p className="text-[10px] text-white/40 text-center pt-1">
                        +{items.length - 3} más
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-amber-500/25 to-pink-500/25 flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-white">Accesos rápidos</h3>
                <p className="text-[10.5px] text-white/40">Lo que más vas a usar</p>
              </div>
            </div>
          </div>
          <div className="p-3 space-y-2">
            <QuickAction icon={Plus} label="Crear proyecto nuevo" hint="Carga datos y BC3" to="/proyectos/nuevo" variant="violet" />
            <QuickAction icon={Layers} label="Planificación BC3" hint={`${stats.conPres} proyectos`} to="/planificacion" variant="cyan" />
            <QuickAction icon={CalIcon} label="Calendario semanal" hint="Google Calendar" to="/calendario" variant="pink" />
            <QuickAction icon={CheckCircle2} label="Certificaciones" hint="Workflow Origen-Anterior-Actual" to="/certificaciones" variant="emerald" />
            <QuickAction icon={ListChecks} label="Mediciones" hint="Avance por partida" to="/mediciones" variant="amber" />
          </div>
        </GlassCard>
      </section>

      {/* ===== PROYECTOS RECIENTES + INSIGHTS ===== */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <GlassCard className="xl:col-span-2 p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center">
                <Building2 className="h-3.5 w-3.5 text-violet-300" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-white">Proyectos recientes</h3>
                <p className="text-[10.5px] text-white/40">Los últimos {Math.min(proyectos.length, 8)}</p>
              </div>
            </div>
            <Link
              to="/proyectos"
              className="text-[11.5px] text-white/55 hover:text-white font-medium flex items-center gap-1"
            >
              Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {proyectos.length === 0 ? (
            <EmptyProyectos onCreate={() => navegar('/proyectos/nuevo')} />
          ) : (
            <div className="divide-y divide-white/[0.04] max-h-[440px] overflow-y-auto">
              {proyectos.slice(0, 8).map((p) => {
                const cfg = ESTADO_CFG[p.estado] || ESTADO_CFG.activo
                const total = p.presupuestoResumen?.presupuestoTotal || 0
                return (
                  <Link
                    key={p.id}
                    to={`/proyectos/${p.id}`}
                    className="group flex items-center gap-3.5 px-5 py-3 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className={`h-9 w-9 rounded-xl ${cfg.bg} border border-white/[0.05] flex items-center justify-center flex-shrink-0`}>
                      <Building2 className={`h-4 w-4 ${cfg.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-white/55">
                          {p.numeroCaso}
                        </span>
                        <span className={`text-[9.5px] font-semibold uppercase tracking-wider ${cfg.text}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-[13px] text-white/90 font-medium truncate mt-0.5">{p.nombre}</p>
                      <p className="text-[10.5px] text-white/40 mt-0.5 truncate">
                        {p.comuna || p.direccion || '—'} · {timeAgo(p.fechaActualizacion || p.fechaCreacion)}
                      </p>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-[12.5px] font-bold text-white/85">
                        {p.tienePresupuesto ? formatMoney(total, p.moneda) : '—'}
                      </p>
                      <p className="text-[10px] text-white/35">
                        {p.presupuestoResumen?.totalPartidas || 0} partidas
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/25 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                )
              })}
            </div>
          )}
        </GlassCard>

        {/* Insights */}
        <div className="space-y-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500/25 to-cyan-500/25 flex items-center justify-center">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
              </div>
              <h3 className="text-[14px] font-semibold text-white">Salud del portfolio</h3>
            </div>
            <PortfolioBar
              total={stats.total}
              activos={stats.activos}
              estudio={stats.enEstudio}
              completados={stats.completados}
            />
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <Mini label="Activos" value={stats.activos} dotClass="bg-violet-400" />
              <Mini label="Estudio" value={stats.enEstudio} dotClass="bg-cyan-400" />
              <Mini label="Completos" value={stats.completados} dotClass="bg-emerald-400" />
            </div>
          </GlassCard>

          <GlassCard className="p-5 relative overflow-hidden">
            <div
              className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30"
              style={{ background: 'radial-gradient(circle, rgba(255,90,138,.6), transparent 70%)' }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="h-4 w-4 text-pink-300" />
                <span className="text-[10.5px] uppercase tracking-[0.12em] font-semibold text-pink-300">
                  Sugerencia IA
                </span>
              </div>
              <p className="text-[13px] text-white/85 leading-relaxed">
                {stats.sinPres > 0
                  ? <>Tienes <strong className="text-white">{stats.sinPres}</strong> proyecto{stats.sinPres > 1 ? 's' : ''} sin presupuesto BC3 cargado. Sin presupuesto no podrás generar certificaciones.</>
                  : stats.total === 0
                    ? <>Crea tu primer proyecto para empezar. Te guiaremos en cada paso del flujo de obra.</>
                    : <>Buen ritmo. Considera revisar las certificaciones pendientes esta semana.</>
                }
              </p>
              <button
                onClick={() => navegar(stats.sinPres > 0 ? '/planificacion' : stats.total === 0 ? '/proyectos/nuevo' : '/certificaciones')}
                className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-pink-300 hover:text-pink-200 font-medium"
              >
                <Sparkles className="h-3 w-3" />
                {stats.sinPres > 0 ? 'Subir BC3' : stats.total === 0 ? 'Crear proyecto' : 'Revisar'}
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  )
}

/* ============================================================ */
/* Sub-components                                               */
/* ============================================================ */

function QuickAction({ icon: Icon, label, hint, to, variant = 'violet' }) {
  const grad = {
    violet: 'from-violet-500 to-violet-700',
    pink: 'from-pink-500 to-rose-600',
    cyan: 'from-cyan-400 to-sky-600',
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
  }[variant]

  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group"
    >
      <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-md flex-shrink-0`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-medium text-white/90 truncate">{label}</p>
        <p className="text-[10.5px] text-white/40 truncate">{hint}</p>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-white/25 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all" />
    </Link>
  )
}

function PortfolioBar({ total, activos, estudio, completados }) {
  if (!total) {
    return (
      <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
        <div className="h-full w-0" />
      </div>
    )
  }
  const a = (activos / total) * 100
  const e = (estudio / total) * 100
  const c = (completados / total) * 100
  return (
    <div className="space-y-2">
      <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden flex">
        <div className="h-full bg-gradient-to-r from-violet-400 to-violet-500" style={{ width: `${a}%` }} />
        <div className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500" style={{ width: `${e}%` }} />
        <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ width: `${c}%` }} />
      </div>
      <p className="text-[10.5px] text-white/40">
        {total} proyecto{total !== 1 ? 's' : ''} · distribución por estado
      </p>
    </div>
  )
}

function Mini({ label, value, dotClass }) {
  return (
    <div className="glass-soft rounded-lg py-2 px-1">
      <div className="flex items-center justify-center gap-1 mb-0.5">
        <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
        <span className="text-[14px] font-bold text-white">{value}</span>
      </div>
      <p className="text-[9.5px] text-white/45 uppercase tracking-wider">{label}</p>
    </div>
  )
}

function EmptyProyectos({ onCreate }) {
  return (
    <div className="px-6 py-14 text-center">
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500/30 via-pink-500/20 to-cyan-500/30 mx-auto flex items-center justify-center mb-4 shadow-[0_0_40px_-10px_rgba(124,77,255,.6)]">
        <Sparkles className="h-6 w-6 text-violet-200" />
      </div>
      <p className="text-[14px] font-semibold text-white/85 mb-1">Aún no hay proyectos</p>
      <p className="text-[12px] text-white/45 mb-4 max-w-xs mx-auto">
        Crea tu primer proyecto y empieza a gestionar tu obra con C-MIDE.
      </p>
      <button
        onClick={onCreate}
        className="btn-primary inline-flex items-center gap-1.5 text-[12.5px]"
      >
        <Plus className="h-3.5 w-3.5" /> Crear primer proyecto
      </button>
    </div>
  )
}
