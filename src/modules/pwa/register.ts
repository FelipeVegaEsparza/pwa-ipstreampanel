import { registerPwaInstall } from '@/core/api'

export const DEVICE_ID_KEY = 'ipstream_device_id'
export const DEVICE_REGISTERED_PREFIX = 'ipstream_device_registered_'

/** Registros en curso por clientId: evita doble POST ante efectos duplicados o pestañas del mismo módulo. */
const inFlightRegistrations = new Map<string, Promise<void>>()

/** UUID v4 seguro; si crypto.randomUUID no existe (contexto no seguro) se construye con getRandomValues. */
function randomUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  try {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    // Versión 4 y variante 10 del RFC 4122.
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  } catch {
    // getRandomValues tampoco disponible: último respaldo con Math.random.
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const random = (Math.random() * 16) | 0
      const value = char === 'x' ? random : (random & 0x3) | 0x8
      return value.toString(16)
    })
  }
}

function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    // Almacenamiento no disponible (modo privado/cuota): se continúa sin persistir.
    return null
  }
}

function writeStored(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Almacenamiento no disponible: se omite la persistencia (best-effort).
  }
}

export function getDeviceId(): string {
  const existing = readStored(DEVICE_ID_KEY)
  if (existing) return existing
  const deviceId = randomUuid()
  writeStored(DEVICE_ID_KEY, deviceId)
  return deviceId
}

function isRegistered(clientId: string): boolean {
  return readStored(`${DEVICE_REGISTERED_PREFIX}${clientId}`) === 'true'
}

function markRegistered(clientId: string): void {
  writeStored(`${DEVICE_REGISTERED_PREFIX}${clientId}`, 'true')
}

export function ensurePwaRegistered(clientId: string): Promise<void> {
  const inFlight = inFlightRegistrations.get(clientId)
  if (inFlight) return inFlight

  const registration = performRegistration(clientId).finally(() => {
    // Se elimina también ante rechazo para permitir reintentar en la próxima carga.
    inFlightRegistrations.delete(clientId)
  })
  inFlightRegistrations.set(clientId, registration)
  return registration
}

async function performRegistration(clientId: string): Promise<void> {
  if (isRegistered(clientId)) return

  const deviceId = getDeviceId()
  try {
    await registerPwaInstall(clientId, deviceId)
    markRegistered(clientId)
  } catch {
    // Sin conexión o error transitorio: se reintentará en la próxima carga.
  }
}
