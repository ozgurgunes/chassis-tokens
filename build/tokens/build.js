import fs from 'fs'
import StyleDictionary from 'style-dictionary'
import registerDictionary from './dictionary.js'
import permutateThemes from './permutateThemes.js'
import config from './config.js'

registerDictionary(StyleDictionary)

async function readThemesFile(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    throw error
  }
}

async function processConfig(cfg, platform) {
  const build_sets = [
    'default_docs_light',
    'chassis_docs_light',
    'chassis_docs_dark',
    'chassis_test_light',
  ]
  if (build_sets.length && !build_sets.includes(cfg.name)) {
    console.log(`Skipped: ${cfg.name}`)
    return
  }
  let options = (platform == 'web') ? 'web' : 'mobile'
  cfg.source = [
    `dist/tokens/json/${cfg.name}-${options}.json`
  ]
  const sd = StyleDictionary.extend(cfg)
  sd.cleanPlatform(platform)
  sd.buildPlatform(platform)
}

export async function build() {
  const $themes = await readThemesFile('tokens/$themes.json')
  const themes = permutateThemes($themes)

  const configs = Object.entries(themes).map(([name, tokensets]) => config(name))

  console.log('\nBuild started...')
  console.log('\n==============================================')

  const platforms = Object.keys(configs[0].platforms)
  for (const platform of platforms) {
    console.log(`\nProcessing: [${platform}]`)
    console.log('\n==============================================')

    await Promise.all(configs.map(cfg => processConfig(cfg, platform)))

    console.log('\n==============================================')
    console.log('\nEnd processing')
  }
  console.log('\n==============================================')
  console.log('\nBuild completed!\n')
}

build()
