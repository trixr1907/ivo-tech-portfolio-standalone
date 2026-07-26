import { cp, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = resolve(projectRoot, 'dist')

await mkdir(resolve(distRoot, 'server'), { recursive: true })
await mkdir(resolve(distRoot, '.openai'), { recursive: true })
await cp(resolve(projectRoot, 'worker/index.js'), resolve(distRoot, 'server/index.js'))
await cp(resolve(projectRoot, '.openai/hosting.json'), resolve(distRoot, '.openai/hosting.json'))

console.log('Sites build prepared: dist/server/index.js and dist/.openai/hosting.json')
