#!/usr/bin/env node
/**
 * Crea la configuración de un cliente nuevo y valida el build.
 *
 * Uso: node scripts/new-client.mjs <nombre> <clientId> [nombre-amigable]
 *
 * Genera clients/<nombre>/client.json y ejecuta el build de ese cliente
 * para confirmar que queda listo para desplegar.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const [name, clientId, friendlyName] = process.argv.slice(2)

const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

if (!name || !clientId) {
  console.error('Uso: node scripts/new-client.mjs <nombre> <clientId> [nombre-amigable]')
  process.exit(1)
}

if (!NAME_PATTERN.test(name)) {
  console.error(
    `Nombre inválido: "${name}". Usa kebab-case (minúsculas, guiones): ej. radio-fusion-austral`
  )
  process.exit(1)
}

if (!/^cm/i.test(clientId)) {
  console.warn(`Aviso: el clientId "${clientId}" no parece del formato Prisma (empieza con "cm...").`)
}

const clientDir = resolve(root, 'clients', name)
const clientPath = resolve(clientDir, 'client.json')
if (existsSync(clientPath)) {
  console.error(`Ya existe clients/${name}/client.json. Usa otro nombre o edítalo directamente.`)
  process.exit(1)
}

const clientConfig = {
  clientId,
  name: friendlyName || name
}

mkdirSync(clientDir, { recursive: true })
writeFileSync(clientPath, `${JSON.stringify(clientConfig, null, 2)}\n`)
console.log(`✓ Creado ${clientPath.replace(root + '/', '')}`)

console.log(`Building client "${name}" para validar...`)
const result = spawnSync(
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['run', 'build:client', '--', name],
  { cwd: root, stdio: 'inherit' }
)

if (result.status === 0) {
  console.log('\n✓ Cliente listo. Despliégalo en Dockploy con CLIENT=' + name)
} else {
  console.error('\n✗ El build falló. Revisa los errores anteriores.')
}
process.exit(result.status ?? 1)
