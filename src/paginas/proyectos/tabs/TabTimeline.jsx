// ===== Tab Timeline — Vista temporal del proyecto =====
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, ExternalLink, CalendarDays, Clock } from 'lucide-react'
import GlassCard from '../../../componentes/ui/GlassCard'

export default function TabTimeline({ proyecto }) {
  const eventos = []
  if (proyecto.fechaCreacion) {
    eventos.push({ titulo: 'Proyecto creado', fecha: proyecto.fechaCreacion, color: 'violet' })
  }
  if (proyecto.fechaInicio) {
    eventos.push({ titulo: 'Inicio de obra', fecha: proyecto.fechaInicio, color: 'pink' })
  }
  if (proyecto.fechaFin) {
    eventos.push({ titulo: 'Fin de obra previsto', fecha: proyecto.fechaFin, color: 'cyan' })
  }
  if (proyecto.fechaActualizacion) {
    eventos.push({ titulo: 'Última actualización', fecha: proyecto.fechaActualizacion, color: 'emerald' })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <GlassCard className="lg:col-span-2 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500/25 to-pink-500/15 flex items-center justify-center">
            <CalendarDays className="h-3.5 w-3.5 text-violet-300" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-white">Línea de tiempo</h3>
            <p className="text-[10.5px] text-white/45">Eventos clave del proyecto</p>
          </div>
        </div>

        {eventos.length === 0 ? (
          <div className="py-10 text-center text-white/40 text-[12.5px]">
            Sin eventos registrados aún
          </div>
        ) : (
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-violet-400/40 via-pink-400/30 to-transparent" />
            <div className="space-y-4">
              {eventos.map((e, i) => {
                const accent = {
                  violet: 'bg-violet-400 shadow-[0_0_12px_rgba(124,77,255,.6)]',
                  pink: 'bg-pink-400 shadow-[0_0_12px_rgba(255,90,138,.6)]',
                  cyan: 'bg-cyan-400 shadow-[0_0_12px_rgba(77,199,255,.6)]',
                  emerald: 'bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,.6)]',
                }[e.color]
                const fecha = e.fecha?.toDate?.() || new Date(e.fecha)
                return (
                  <div key={i} className="relative">
                    <span className={`absolute -left-[18px] top-1 h-2.5 w-2.5 rounded-full ${accent} ring-4 ring-[rgba(20,20,28,.5)]`} />
                    <div>
                      <p className="text-[12.5px] font-semibold text-white">{e.titulo}</p>
                      <p className="text-[10.5px] text-white/45 mt-0.5">
                        {fecha.toLocaleDateString('es-ES', {
                          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </GlassCard>

      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyan-500/25 to-sky-500/15 flex items-center justify-center">
            <Calendar className="h-3.5 w-3.5 text-cyan-300" />
          </div>
          <h3 className="text-[14px] font-semibold text-white">Calendar & Gantt</h3>
        </div>

        <p className="text-[12px] text-white/55 leading-relaxed mb-4">
          Conecta este proyecto con tu calendario y visualiza el Gantt completo desde la sección de planificación.
        </p>

        <div className="space-y-2">
          <Link
            to="/calendario"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/15 text-cyan-200 text-[12px] font-medium transition-colors group"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Abrir calendario</span>
            <ArrowRight className="h-3 w-3 ml-auto group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/planificacion"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/15 text-violet-200 text-[12px] font-medium transition-colors group"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Ir a Planificación</span>
            <ArrowRight className="h-3 w-3 ml-auto group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </GlassCard>
    </div>
  )
}
