// ===== Tab Mediciones — Estado del BC3 y avance por partida =====
import { Link } from 'react-router-dom'
import { Layers, Upload, ArrowRight, AlertTriangle, CheckCircle2, Ruler } from 'lucide-react'
import GlassCard from '../../../componentes/ui/GlassCard'

export default function TabMediciones({ proyecto }) {
  const tieneBC3 = !!proyecto.tienePresupuesto
  const partidas = proyecto.presupuestoResumen?.totalPartidas || 0
  const total = proyecto.presupuestoResumen?.presupuestoTotal || 0
  const moneda = proyecto.moneda || 'CLP'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <GlassCard className="lg:col-span-2 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500/25 to-teal-500/15 flex items-center justify-center">
              <Layers className="h-3.5 w-3.5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-white">Mediciones BC3</h3>
              <p className="text-[10.5px] text-white/45">Avance por partida del presupuesto</p>
            </div>
          </div>
          {tieneBC3 ? (
            <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              BC3 cargado
            </span>
          ) : (
            <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Sin BC3
            </span>
          )}
        </div>

        {!tieneBC3 ? (
          <div className="text-center py-12">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/15 mx-auto flex items-center justify-center mb-3">
              <Upload className="h-6 w-6 text-emerald-300" />
            </div>
            <p className="text-[14px] font-semibold text-white mb-1">Sube el presupuesto BC3</p>
            <p className="text-[12px] text-white/50 mb-4 max-w-md mx-auto">
              Importa el archivo BC3 para empezar a registrar mediciones por partida y generar certificaciones.
            </p>
            <Link
              to="/planificacion"
              className="btn-primary inline-flex items-center gap-1.5 text-[12.5px]"
            >
              <Upload className="h-3.5 w-3.5" /> Subir BC3
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <KPI label="Partidas" value={partidas} accent="violet" />
              <KPI label="Total" value={(total / 1e6).toFixed(1) + 'M'} suffix={moneda} accent="pink" />
              <KPI label="Mediciones" value="—" accent="cyan" />
            </div>
            <Link
              to="/mediciones"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-200 text-[12.5px] font-medium transition-colors group"
            >
              <Ruler className="h-3.5 w-3.5" />
              <span>Abrir módulo de Mediciones</span>
              <ArrowRight className="h-3 w-3 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        )}
      </GlassCard>

      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500/25 to-pink-500/15 flex items-center justify-center">
            <Ruler className="h-3.5 w-3.5 text-violet-300" />
          </div>
          <h3 className="text-[13.5px] font-semibold text-white">Flujo recomendado</h3>
        </div>
        <ol className="space-y-2.5 text-[12px] text-white/65">
          <Step n="1" text="Carga el archivo BC3 en Planificación" />
          <Step n="2" text="Revisa partidas y APU generadas" />
          <Step n="3" text="Registra avance en Mediciones por partida" />
          <Step n="4" text="Genera certificaciones (Origen → Anterior → Actual)" />
        </ol>
      </GlassCard>
    </div>
  )
}

function KPI({ label, value, suffix, accent = 'violet' }) {
  const text = {
    violet: 'text-violet-300', pink: 'text-pink-300', cyan: 'text-cyan-300',
  }[accent]
  return (
    <div className="glass-soft rounded-xl px-3 py-2.5">
      <p className="text-[9.5px] uppercase tracking-wider text-white/40 font-medium">{label}</p>
      <p className="text-[15px] font-bold text-white mt-1">
        {value}
        {suffix && <span className={`text-[10px] font-normal ml-1 ${text}`}>{suffix}</span>}
      </p>
    </div>
  )
}

function Step({ n, text }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="h-5 w-5 rounded-md bg-violet-500/15 text-violet-300 text-[10.5px] font-bold flex items-center justify-center flex-shrink-0">
        {n}
      </span>
      <span>{text}</span>
    </li>
  )
}
