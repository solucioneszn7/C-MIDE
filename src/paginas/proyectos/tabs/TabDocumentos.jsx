// ===== Tab Documentos — Drive folder + accesos rápidos =====
import { Folder, ExternalLink, FileText, FileSpreadsheet, FileImage, Plus, Cloud } from 'lucide-react'
import GlassCard from '../../../componentes/ui/GlassCard'
import toast from 'react-hot-toast'

const TIPOS_DOC = [
  { icon: FileText, label: 'Contratos', color: 'violet', desc: 'PDF / Word' },
  { icon: FileSpreadsheet, label: 'Presupuestos', color: 'emerald', desc: 'BC3 / Excel' },
  { icon: FileImage, label: 'Planos', color: 'cyan', desc: 'DWG / PDF' },
  { icon: FileText, label: 'Actas', color: 'pink', desc: 'PDF / Word' },
  { icon: FileSpreadsheet, label: 'Mediciones', color: 'amber', desc: 'Excel' },
  { icon: FileText, label: 'Otros', color: 'slate', desc: 'Varios' },
]

const COLOR_DOC = {
  violet: { grad: 'from-violet-500/25 to-violet-700/10', text: 'text-violet-300' },
  emerald: { grad: 'from-emerald-500/25 to-teal-700/10', text: 'text-emerald-300' },
  cyan: { grad: 'from-cyan-500/25 to-sky-700/10', text: 'text-cyan-300' },
  pink: { grad: 'from-pink-500/25 to-rose-700/10', text: 'text-pink-300' },
  amber: { grad: 'from-amber-500/25 to-orange-700/10', text: 'text-amber-300' },
  slate: { grad: 'from-slate-500/15 to-slate-700/5', text: 'text-slate-300' },
}

export default function TabDocumentos({ proyecto }) {
  const driveUrl = proyecto.driveFolderId ? `https://drive.google.com/drive/folders/${proyecto.driveFolderId}` : null

  return (
    <div className="space-y-4">
      {/* Drive integration */}
      <GlassCard className="p-5 relative overflow-hidden">
        <div
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(77,199,255,.6), transparent 70%)' }}
        />
        <div className="relative flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <Cloud className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[14.5px] font-semibold text-white">Carpeta de Google Drive</h3>
            <p className="text-[12px] text-white/55 mt-0.5">
              {driveUrl
                ? 'Toda la documentación del proyecto sincronizada en Drive.'
                : 'Aún no hay carpeta vinculada. Crea o vincula una para empezar.'}
            </p>
          </div>
          {driveUrl ? (
            <a
              href={driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-[12.5px] flex items-center gap-1.5"
            >
              Abrir Drive
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          ) : (
            <button
              onClick={() => toast('Próximamente: vincular carpeta')}
              className="btn-ghost text-[12.5px] flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Vincular
            </button>
          )}
        </div>
      </GlassCard>

      {/* Tipos de documento */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500/25 to-pink-500/15 flex items-center justify-center">
              <Folder className="h-3.5 w-3.5 text-violet-300" />
            </div>
            <h3 className="text-[14px] font-semibold text-white">Tipos de documento</h3>
          </div>
          <button
            onClick={() => toast('Próximamente: subir archivo')}
            className="btn-ghost text-[12px] flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> Subir
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {TIPOS_DOC.map((tipo, i) => {
            const Icon = tipo.icon
            const cfg = COLOR_DOC[tipo.color]
            return (
              <button
                key={i}
                onClick={() => driveUrl ? window.open(driveUrl, '_blank') : toast('Vincula primero la carpeta de Drive')}
                className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${cfg.grad} border border-white/[0.06] p-3 hover:border-white/[0.12] transition-all hover:translate-y-[-1px]`}
              >
                <div className="flex items-center justify-center h-12 mb-2">
                  <Icon className={`h-7 w-7 ${cfg.text} group-hover:scale-110 transition-transform`} />
                </div>
                <p className="text-[12px] font-semibold text-white text-center">{tipo.label}</p>
                <p className="text-[9.5px] text-white/40 text-center mt-0.5">{tipo.desc}</p>
              </button>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}
