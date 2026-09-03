#!/usr/bin/env node
/**
 * Build de un cliente específico.
 *
 * Uso: node scripts/build-client.mjs <nombre-del-cliente>
 *
 * Lee clients/<nombre>/client.json, inyecta el clientId (y nombre) en el
 * build via variables VITE_* y genera dist/<nombre>/ listo para desplegar
 * de forma independiente (p. ej. en Dockploy).
 */
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const clientName = process.argv[2]

if (!clientName) {
  console.error('Uso: node scripts/build-client.mjs <nombre-del-cliente>')
  process.exit(1)
}

const clientPath = resolve(root, 'clients', clientName, 'client.json')
let clientConfig
try {
  clientConfig = JSON.parse(readFileSync(clientPath, 'utf8'))
} catch (error) {
  console.error(
    `No se pudo leer clients/${clientName}/client.json: ${error.message}`
  )
  process.exit(1)
}

if (!clientConfig.clientId) {
  console.error(`clients/${clientName}/client.json debe incluir "clientId"`)
  process.exit(1)
}

const outDir = resolve(root, 'dist', clientName)

console.log(
  `Building client "${clientName}" (clientId: ${clientConfig.clientId}) -> ${outDir}`
)

const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['vite', 'build', '--mode', clientName, '--outDir', outDir],
  {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      VITE_CLIENT_ID: clientConfig.clientId,
      VITE_CLIENT_NAME: clientConfig.name || clientName
    }
  }
)

process.exit(result.status ?? 1)
