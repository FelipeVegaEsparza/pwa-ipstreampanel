#!/usr/bin/env node
/**
 * Build de un cliente específico.
 *
 * Uso: node scripts/build-client.mjs <nombre-del-cliente>
 *
 * Lee clients/<nombre>/client.json, inyecta el clientId (y nombre) en el
 * build via variables VITE_* y genera dist/<nombre>/ listo para desplegar
 * de forma independiente (p. ej. en Dockploy).
 *
 * Se construye primero en dist/.build-<nombre> y solo si el build tiene éxito
 * se reemplaza dist/<nombre> (rmSync + renameSync), para no dejar artefactos
 * a medias ni pisar un dist/<cliente> válido con un build fallido.
 */
import { spawnSync } from 'node:child_process'
import { readFileSync, rmSync, renameSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// Mismo patrón de validación que scripts/new-client.mjs (kebab-case).
const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const clientName = process.argv[2]

if (!clientName) {
  console.error('Uso: node scripts/build-client.mjs <nombre-del-cliente>')
  process.exit(1)
}

if (!NAME_PATTERN.test(clientName)) {
  console.error(
    `Nombre inválido: "${clientName}". Usa kebab-case (minúsculas, guiones): ej. radio-fusion-austral`
  )
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

const distDir = resolve(root, 'dist')
const tempOutDir = resolve(distDir, `.build-${clientName}`)
const outDir = resolve(distDir, clientName)

console.log(
  `Building client "${clientName}" (clientId: ${clientConfig.clientId}) -> ${outDir}`
)

const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['vite', 'build', '--mode', clientName, '--outDir', tempOutDir],
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

if (result.error || result.status !== 0) {
  // Build fallido: limpiar el directorio temporal y salir con el status del build.
  rmSync(tempOutDir, { recursive: true, force: true })
  console.error(`\n✗ El build de "${clientName}" falló. No se modificó dist/${clientName}.`)
  process.exit(result.status ?? 1)
}

// Build correcto: reemplaza dist/<clientName> por el build recién generado.
rmSync(outDir, { recursive: true, force: true })
renameSync(tempOutDir, outDir)
console.log(`✓ Build completado: ${outDir.replace(root + '/', '')}/`)
