// ===== Tab Equipo — Miembros del proyecto =====
import { useState, useEffect } from 'react'
import { Users as UsersIcon, Crown, Plus, Mail, X, AtSign, Briefcase } from 'lucide-react'
import GlassCard from '../../../componentes/ui/GlassCard'
import { obtenerUsuario } from '../../../servicios/usuarios'
import toast from 'react-hot-toast'

const ROLES = {
  admin:      { label: 'Admin',         color: 'pink',    icon: Crown },
  gestor:     { label: 'Gestor',        color: 'violet',  icon: Briefcase },
  jefe_obra:  { label: 'Jefe de Obra',  color: 'cyan',    icon: Briefcase },
  encargado:  { label: 'Encargado',     color: 'amber',   icon: Briefcase },
  direccion:  { label: 'Dirección',     color: 'emerald', icon: Briefcase },
}

const COLOR_ROL = {
  pink: 'bg-pink-500/15 text-pink-300',
  violet: 'bg-violet-500/15 text-violet-300',
  cyan: 'bg-cyan-500/15 text-cyan-300',
  amber: 'bg-amber-500/15 text-amber-300',
  emerald: 'bg-emerald-500/15 text-emerald-300',
}

export default function TabEquipo({ proyecto }) {
  const [gestor, setGestor] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    async function cargar() {
      if (!proyecto.gestorId) { setCargando(false); return }
      try {
        const u = await obtenerUsuario(proyecto.gestorId)
        if (activo) setGestor(u)
      } catch {
        // silencioso
      } finally {
        if (activo) setCargando(false)
      }
    }
    cargar()
    return () => { activo = false }
  }, [proyecto.gestorId])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <GlassCard className="lg:col-span-2 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500/25 to-pink-500/15 flex items-center justify-center">
              <UsersIcon className="h-3.5 w-3.5 text-violet-300" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-white">Equipo del proyecto</h3>
              <p className="text-[10.5px] text-white/45">Personas con acceso y responsabilidad</p>
            </div>
          </div>
          <button
            onClick={() => toast('Próximamente: invitar miembros')}
            className="btn-ghost text-[12px] flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> Invitar
          </button>
        </div>

        <div className="space-y-2">
          {/* Gestor / Owner */}
          <MemberRow
            nombre={gestor?.nombre || 'Gestor del proyecto'}
            email={gestor?.email}
            rol="admin"
            badge="Owner"
            cargando={cargando && !gestor}
          />

          {/* Cliente / Propietario */}
          {proyecto.propietario?.nombre && (
            <MemberRow
              nombre={proyecto.propietario.nombre}
              email={proyecto.propietario.email}
              rol="direccion"
              badge="Cliente"
              esCliente
            />
          )}

          {/* Empty hint */}
          <div className="mt-4 rounded-xl border border-dashed border-white/[0.08] p-5 text-center">
            <UsersIcon className="h-5 w-5 text-white/30 mx-auto mb-2" />
            <p className="text-[12px] text-white/50">Invita a más miembros del equipo</p>
            <p className="text-[10.5px] text-white/30 mt-1">
              Jefe de obra · Encargado · Dirección facultativa
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Briefcase className="h-3.5 w-3.5 text-cyan-300" />
          <h3 className="text-[13.5px] font-semibold text-white">Roles disponibles</h3>
        </div>
        <div className="space-y-1.5">
          {Object.entries(ROLES).map(([key, r]) => (
            <div key={key} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04]">
              <span className="text-[12px] text-white/75">{r.label}</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${COLOR_ROL[r.color]}`}>
                {key}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

function MemberRow({ nombre, email, rol = 'gestor', badge, esCliente, cargando }) {
  const r = ROLES[rol] || ROLES.gestor
  const colorClasses = COLOR_ROL[r.color]
  const initial = nombre?.charAt(0)?.toUpperCase() || '?'

  if (cargando) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-pulse">
        <div className="h-10 w-10 rounded-xl bg-white/[0.06]" />
        <div className="flex-1">
          <div className="h-3 w-32 bg-white/[0.06] rounded mb-2" />
          <div className="h-2.5 w-24 bg-white/[0.04] rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-colors">
      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${esCliente ? 'from-cyan-500 to-emerald-500' : 'from-violet-500 via-pink-500 to-cyan-500'} flex items-center justify-center shadow-md flex-shrink-0`}>
        <span className="text-[14px] font-bold text-white">{initial}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-semibold text-white truncate">{nombre}</p>
          {badge && (
            <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${colorClasses}`}>
              {badge}
            </span>
          )}
        </div>
        {email && (
          <p className="text-[11px] text-white/45 truncate flex items-center gap-1 mt-0.5">
            <AtSign className="h-2.5 w-2.5" />
            {email}
          </p>
        )}
      </div>
    </div>
  )
}
