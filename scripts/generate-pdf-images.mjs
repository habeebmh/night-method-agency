import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'public/images/pdf')
const functionOutDir = resolve(root, 'functions/assets/pdf')
const outDirs = [outDir, functionOutDir]
const grayscaleProfile = '/System/Library/ColorSync/Profiles/Generic Gray Gamma 2.2 Profile.icc'

const images = [
  {
    source: 'public/images/booth.webp',
    output: 'booth.jpg',
    maxPixels: 1300,
  },
  {
    source: 'public/images/street-portrait.webp',
    output: 'street-portrait.jpg',
    maxPixels: 1000,
    crop: {
      height: 721,
      width: 176,
    },
    grayscale: true,
  },
  {
    source: 'public/images/stage.webp',
    output: 'stage.jpg',
    maxPixels: 1200,
  },
]

for (const directory of outDirs) {
  mkdirSync(directory, { recursive: true })
}

for (const image of images) {
  for (const directory of outDirs) {
    const output = resolve(directory, image.output)
    execFileSync('sips', [
      '-s',
      'format',
      'jpeg',
      '-s',
      'formatOptions',
      '65',
      '-Z',
      String(image.maxPixels),
      resolve(root, image.source),
      '--out',
      output,
    ])

    if (image.crop) {
      execFileSync('sips', [
        '-c',
        String(image.crop.height),
        String(image.crop.width),
        output,
        '--out',
        output,
      ])
    }

    if (image.grayscale) {
      execFileSync('sips', ['-m', grayscaleProfile, output, '--out', output])
    }
  }
}

console.log(`Generated ${images.length} PDF image assets in ${outDirs.join(', ')}`)
