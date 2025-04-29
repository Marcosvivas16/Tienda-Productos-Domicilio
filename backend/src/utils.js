import { createRequire } from 'node:module'
import { writeFileSync } from 'node:fs'

const require = createRequire(import.meta.url)

export const readJSON = (path) => require(path)

export const writeJSON = (path, data) => {
	try {
		writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8')
	} catch (err) {
		console.error(`Error escribiendo el archivo JSON en ${path}:`, err)
		throw err
	}
}
