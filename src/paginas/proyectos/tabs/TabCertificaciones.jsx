// ===== Tab Certificaciones — Workflow Origen-Anterior-Actual =====
import { Link } from 'react-router-dom'
import { FileCheck2, ArrowRight, Lock, FileText, AlertTriangle } from 'lucide-react'
import GlassCard from '../../../componentes/ui/GlassCard'

export default function TabCertificaciones({ proyecto }) {
  const tieneBC3 = !!proyecto.tienePresupuesto

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <GlassCard className="lg:col-span-2 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-amber-500/25 to-orange-500/15 flex items-center justify-center">
            <FileCheck2 className="h-3.5 w-3.5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-white">Certificaciones de obra</h3>
            <p className="text-[10.5px] text-white/45">Workflow Origen → Anterior → Actual</p>
          </div>
        </div>

        {!tieneBC3 ? (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[12.5px] font-semibold text-amber-200">BC3 requerido</p>
              <p className="text-[11.5px] text-amber-200/70 mt-1">
                Para generar certificaciones necesitas subir primero el presupuesto BC3 del proyecto.
              </p>
              <Link
                to="/planificacion"
                className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] text-amber-200 hover:text-amber-100 font-medium"
              >
                Subir BC3 <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <ColumnaCert titulo="Origen" descripcion="Importado del BC3" color="violet" icon={FileText} />
              <ColumnaCert titulo="Anterior" descripcion="Cert. previa cerrada" color="cyan" icon={Lock} />
              <ColumnaCert titulo="Actual" descripcion="En curso, editable" color="pink" icon={FileCheck2} />
            </div>
            <Link
              to="/certificaciones"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 text-amber-200 text-[12.5px] font-medium transition-colors group"
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>Abrir módulo de Certificaciones</span>
              <ArrowRight className="h-3 w-3 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </>
        )}
      </GlassCard>

      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="h-3.5 w-3.5 text-emerald-300" />
          <h3 className="text-[13.5px] font-semibold text-white">Bloqueo de certificación</h3>
        </div>
        <p className="text-[12px] text-white/65 leading-relaxed">
          Al cerrar una certificación, las cantidades quedan bloqueadas como "Anterior" y la nueva certificación arranca con esos valores como base. Garantiza trazabilidad de obra.
        </p>
      </GlassCard>
    </div>
  )
}

function ColumnaCert({ titulo, descripcion, color, icon: Icon }) {
  const cfg = {
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-300', border: 'border-violet-500/20' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-300', border: 'border-cyan-500/20' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-300', border: 'border-pink-500/20' },
  }[color]
  return (
    <div className={`rounded-xl ${cfg.bg} border ${cfg.border} p-3 text-center`}>
      <Icon className={`h-4 w-4 ${cfg.text} mx-auto mb-1.5`} />
      <p className={`text-[12px] font-semibold ${cfg.text}`}>{titulo}</p>
      <p className="text-[10px] text-white/50 mt-0.5">{descripcion}</p>
    </div>
  )
}
