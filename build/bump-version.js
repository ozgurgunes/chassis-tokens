#!/usr/bin/env node

/*!
 * Script to update version number references in the project.
 * Copyright 2025 Ozgur Gunes
 * Licensed under MIT (https://github.com/ozgurgunes/chassis-tokens/blob/main/LICENSE)
 */

import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'

const DRY_RUN = process.argv.includes('--dry') || process.argv.includes('--dry-run')

// These are the files we only care about replacing the version
const FILES = [
  'build/font/css.hbs',
  'build/font/scss.hbs',
  'build/tokens/build.js'
]

// Blame TC39... https://github.com/benjamingr/RegExp.escape/issues/37
function regExpQuote(string) {
  return string.replace(/[$()*+-.?[\\\]^{|}]/g, '\\$&')
}

function regExpQuoteReplacement(string) {
  return string.replace(/\$/g, '$$')
}

async function replaceRecursively(file, oldVersion, newVersion) {
  const originalString = await fs.readFile(file, 'utf8')
  const newString = originalString.replace(
    new RegExp(regExpQuote(oldVersion), 'g'),
    regExpQuoteReplacement(newVersion)
  )

  // No need to move any further if the strings are identical
  if (originalString === newString) {
    return
  }

  console.log(`Found ${oldVersion} in ${file}`)

  if (DRY_RUN) {
    return
  }

  await fs.writeFile(file, newString, 'utf8')
}

function bumpNpmVersion(newVersion) {
  if (DRY_RUN) {
    return
  }

  execFile('npm', ['version', newVersion, '--no-git-tag'], { shell: true }, (error) => {
    if (error) {
      console.error(error)
      process.exit(1)
    }
  })
}

function showUsage(args) {
  console.error('USAGE: change-version old_version new_version [--dry[-run]]')
  console.error('Got arguments:', args)
  process.exit(1)
}

async function main(args) {
  let [oldVersion, newVersion] = args

  if (!oldVersion || !newVersion) {
    showUsage(args)
  }

  // Strip any leading `v` from arguments because
  // otherwise we will end up with duplicate `v`s
  [oldVersion, newVersion] = [oldVersion, newVersion].map(arg => {
    return arg.startsWith('v') ? arg.slice(1) : arg
  })

  if (oldVersion === newVersion) {
    showUsage(args)
  }

  bumpNpmVersion(newVersion)

  try {
    await Promise.all(FILES.map(file => replaceRecursively(file, oldVersion, newVersion)))
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main(process.argv.slice(2))
