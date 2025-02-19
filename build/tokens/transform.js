#! /usr/bin/env node
import shell from 'shelljs'
import fs from 'fs'
import permutateThemes from './permutateThemes.js'

/*
Token Transformer Options
--expandTypography: true|false to enable/disable automatic expansion of typography types (default: false)
'--expandTypography=true',
--expandShadow: true|false to enable/disable automatic expansion of boxShadow types (default: false)
'--expandShadow=true',
--preserveRawValue: true|false to enable/disable addition of a rawValue key containing the unresolved value (default: false)
'--preserveRawValue=true',
--resolveReferences: true|false|'math' to enable/disable resolving references, removing any aliases or math expressions (default: true)
'--resolveReferences=false',
--throwErrorWhenNotResolved: true|false to enable/disable throwing errors when a reference fails to resolve (default: false)
'--throwErrorWhenNotResolved=true'
--expandBorder: true|false to enable/disable automatic expansion of border types (default: false)
'--expandBorder=true',
--expandComposition: true|false to enable/disable automatic expansion of composition types (default: false)
'--expandComposition=true',
 */

const optionsWeb = [
  '--preserveRawValue=true',
  '--resolveReferences=false',
]

const optionsMobile = [
  '--expandTypography=true',
  '--expandShadow=true',
]

async function readThemesFile(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading themes file: ${error.message}`)
    process.exit(1)
  }
}

function executeShellCommand(command) {
  const result = shell.exec(command)
  if (result.code !== 0) {
    console.error(`Error executing command: ${command}`)
    process.exit(1)
  }
}

async function transform() {
  const $themes = await readThemesFile('tokens/$themes.json')
  const themes = permutateThemes($themes, { separator: '_' })

  const buildSets = [
    'chassis_docs_light',
    'chassis_docs_dark',
    'test_docs_light',
  ]

  for (const [fileName, tokensets] of Object.entries(themes)) {
    if (buildSets.length && !buildSets.includes(fileName)) {
      console.log(`Skipped: ${fileName}`)
      continue
    }

    console.log(`\nTransforming: ${fileName}`)
    console.log('==============================================')

    const webCommand = `npx token-transformer tokens dist/tokens/json/${fileName}-web.json ${tokensets.sets.join()} ${tokensets.excludes.join()} ${optionsWeb.join(' ')}`
    const mobileCommand = `npx token-transformer tokens dist/tokens/json/${fileName}-mobile.json ${tokensets.sets.join()} ${tokensets.excludes.join()} ${optionsMobile.join(' ')}`

    executeShellCommand(webCommand)
    executeShellCommand(mobileCommand)

    console.log('==============================================')
  }

  console.log('\nTransform completed!\n')
}

transform()
