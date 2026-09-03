import { registerPwaInstall } from '@/core/api'

export const DEVICE_ID_KEY = 'ipstream_device_id'
export const DEVICE_REGISTERED_PREFIX = 'ipstream_device_registered_'

export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY)
  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }
  return deviceId
}

function isRegistered(clientId: string): boolean {
  return localStorage.getItem(`${DEVICE_REGISTERED_PREFIX}${clientId}`) === 'true'
}

function markRegistered(clientId: string): void {
  localStorage.setItem(`${DEVICE_REGISTERED_PREFIX}${clientId}`, 'true')
}

export async function ensurePwaRegistered(clientId: string): Promise<void> {
  if (isRegistered(clientId)) return

  const deviceId = getDeviceId()
  try {
    await registerPwaInstall(clientId, deviceId)
    markRegistered(clientId)
  } catch {
    // Sin conexión o error transitorio: se reintentará en la próxima carga.
  }
}
