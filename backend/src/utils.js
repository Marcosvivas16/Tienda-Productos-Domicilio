import { writeFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const resolvePath = (relativePath) => resolve(__dirname, '..', relativePath)

export const readJSON = (absolutePath) => {
  try {
    const data = readFileSync(absolutePath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error(`Error leyendo el archivo JSON en ${absolutePath}:`, err)
    throw err
  }
}

export const writeJSON = (absolutePath, data) => {
  try {
    writeFileSync(absolutePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error(`Error escribiendo el archivo JSON en ${absolutePath}:`, err)
    throw err
  }
}