import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

test('an empty packet cannot replace an existing PDF', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'festival-outreach-'))
  const outputPath = path.join(tempDir, 'Habeeb_Manager_Outreach_2026-09-07.pdf')
  await writeFile(outputPath, 'existing packet')

  try {
    let outputModule = {}
    try {
      outputModule = await import('./festival-outreach-output.mjs')
    } catch (error) {
      if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error
    }

    assert.equal(
      typeof outputModule.writeValidatedPdfAtomically,
      'function',
      'writeValidatedPdfAtomically must exist',
    )

    await assert.rejects(
      outputModule.writeValidatedPdfAtomically({
        entries: [],
        outputPath,
        render: async (tempPath) => writeFile(tempPath, 'empty replacement'),
      }),
      /at least one send-ready festival entry/i,
    )

    assert.equal(await readFile(outputPath, 'utf8'), 'existing packet')
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
})
