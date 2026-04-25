// ===== Tab Resumen — Información general del proyecto =====
import { MapPin, User, Phone, Mail, FileText, Calendar, Hash, Wallet, BarChart3, Globe } from 'lucide-react'
import { formatearFecha } from '../../../utils/generadores'
import { obtenerMontoAcordado, obtenerPorcentajeEjecucion, formatearMontoCorto } from '../../../servicios/financiero'
import GlassCard from '../../../componentes/ui/GlassCard'

const MONEDA_FLAG = { CLP: 'CL', EUR: 'EU', USD: 'US', CAD: 'CA' }

export default function TabResumen({ proyecto }) {
  const monto = obtenerMontoAcordado(proyecto)
  const pct = obtenerPorcentajeEjecucion(proyecto)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Datos del proyecto */}
      <GlassCard className="p-5">
        <SectionHeader icon={Hash} title="Datos del proyecto" />
        <div className="space-y-3">
          <Row icon={Hash} label="Número de caso" value={proyecto.numeroCaso} mono />
          <Row icon={MapPin} label="Dirección" value={proyecto.direccion || '—'} />
          <Row icon={MapPin} label="Comuna" value={proyecto.comuna || '—'} />
          <Row icon={Globe} label="Moneda" value={`${MONEDA_FLAG[proyecto.moneda] || ''} ${proyecto.moneda || 'CLP'}`} />
          <Row icon={Calendar} label="Creado" value={formatearFecha(proyecto.fechaCreacion) || '—'} />
        </div>
      </GlassCard>

      {/* Propietario */}
      <GlassCard className="p-5">
        <SectionHeader icon={User} title="Propietario" />
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/[0.05]">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 via-pink-500 to-cyan-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-[16px] font-bold text-white">
              {proyecto.propietario?.nombre?.charAt(0)?.toUpperCase() || 'C'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-white truncate">
              {proyecto.propietario?.nombre || 'Sin propietario'}
            </p>
            <p className="text-[11px] text-white/45 truncate">
              {proyecto.propietario?.rut || '—'}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <Row icon={Phone} label="Teléfono" value={proyecto.propietario?.telefono || '—'} />
          <Row icon={Mail} label="Email" value={proyecto.propietario?.email || '—'} />
        </div>
      </GlassCard>

      {/* Resumen financiero */}
      <GlassCard className="p-5 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(124,77,255,.6), transparent 70%)' }}
        />
        <div className="relative">
          <SectionHeader icon={Wallet} title="Estado financiero" accent="violet" />
          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.1em] text-white/40 font-semibold mb-1">
                Monto acordado
              </p>
              <p className="text-[26px] font-bold text-white tracking-tight">
                {monto > 0 ? formatearMontoCorto(monto) : '—'}
                <span className="text-[12px] font-normal text-white/45 ml-2">{proyecto.moneda || 'CLP'}</span>
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] uppercase tracking-[0.1em] text-white/40 font-semibold">Avance</p>
                <span className="text-[12.5px] font-bold text-white">{pct}%</span>
              </div>
              <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.05]">
              <MiniStat label="Partidas" value={proyecto.presupuestoResumen?.totalPartidas || 0} />
              <MiniStat label="BC3" value={proyecto.tienePresupuesto ? 'Cargado' : 'Sin BC3'} />
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

function SectionHeader({ icon: Icon, title, accent = 'slate' }) {
  const grad = {
    violet: 'from-violet-500/25 to-violet-700/10',
    slate: 'from-white/[0.08] to-white/[0.02]',
  }[accent]
  const text = { violet: 'text-violet-300', slate: 'text-white/65' }[accent]
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${grad} flex items-center justify-center`}>
        <Icon className={`h-3.5 w-3.5 ${text}`} />
      </div>
      <h3 className="text-[13.5px] font-semibold text-white">{title}</h3>
    </div>
  )
}

function Row({ icon: Icon, label, value, mono = false }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="h-3.5 w-3.5 text-white/35 mt-0.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium">{label}</p>
        <p className={`text-[12.5px] text-white/85 truncate ${mono ? 'font-mono' : ''}`}>{value}</p>
      </div>
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="glass-soft rounded-lg px-2.5 py-2">
      <p className="text-[9.5px] uppercase tracking-wider text-white/40 font-medium">{label}</p>
      <p className="text-[13px] font-semibold text-white mt-0.5">{value}</p>
    </div>
  )
}
