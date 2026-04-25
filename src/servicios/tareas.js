// ===== Servicio de Tareas — Kanban Trello/Monday-style =====
// Subcollection: proyectos/{proyectoId}/tareas
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore'
import { db } from './firebase'

const SUBCOL = 'tareas'

export const ESTADOS_TAREA = [
  { key: 'backlog',     label: 'Backlog' },
  { key: 'pendiente',   label: 'Por hacer' },
  { key: 'en_curso',    label: 'En curso' },
  { key: 'revision',    label: 'En revisión' },
  { key: 'completada',  label: 'Completada' },
]

export const PRIORIDADES = [
  { key: 'baja',   label: 'Baja' },
  { key: 'media',  label: 'Media' },
  { key: 'alta',   label: 'Alta' },
  { key: 'urgente',label: 'Urgente' },
]

function refTareas(proyectoId) {
  return collection(db, 'proyectos', proyectoId, SUBCOL)
}

export function escucharTareas(proyectoId, callback) {
  const q = query(refTareas(proyectoId))
  return onSnapshot(q, (snap) => {
    const tareas = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => {
        const oA = a.orden ?? Infinity
        const oB = b.orden ?? Infinity
        if (oA !== oB) return oA - oB
        const fA = a.fechaCreacion?.toMillis?.() || 0
        const fB = b.fechaCreacion?.toMillis?.() || 0
        return fB - fA
      })
    callback(tareas)
  })
}

export async function crearTarea(proyectoId, datos) {
  const tarea = {
    titulo: datos.titulo || 'Nueva tarea',
    descripcion: datos.descripcion || '',
    estado: datos.estado || 'pendiente',
    prioridad: datos.prioridad || 'media',
    asignadoA: datos.asignadoA || null,
    asignadoNombre: datos.asignadoNombre || null,
    etiquetas: datos.etiquetas || [],
    fechaLimite: datos.fechaLimite || null,
    orden: datos.orden ?? 0,
    fechaCreacion: serverTimestamp(),
    fechaActualizacion: serverTimestamp(),
  }
  const docRef = await addDoc(refTareas(proyectoId), tarea)
  return { id: docRef.id, ...tarea }
}

export async function actualizarTarea(proyectoId, tareaId, datos) {
  const ref = doc(db, 'proyectos', proyectoId, SUBCOL, tareaId)
  await updateDoc(ref, {
    ...datos,
    fechaActualizacion: serverTimestamp(),
  })
}

export async function eliminarTarea(proyectoId, tareaId) {
  await deleteDoc(doc(db, 'proyectos', proyectoId, SUBCOL, tareaId))
}
