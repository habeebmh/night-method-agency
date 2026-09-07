import { mkdir, rename, rm, stat } from 'node:fs/promises'
import path from 'node:path'

export async function writeValidatedPdfAtomically({ entries, outputPath, render }) {
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error('The packet must contain at least one send-ready festival entry.')
  }

  await mkdir(path.dirname(outputPath), { recursive: true })
  const tempPath = `${outputPath}.${process.pid}.tmp`

  try {
    await render(tempPath)
    const rendered = await stat(tempPath)
    if (rendered.size === 0) throw new Error('The rendered PDF is empty.')
    await rename(tempPath, outputPath)
  } catch (error) {
    await rm(tempPath, { force: true })
    throw error
  }
}
