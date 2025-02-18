import StyleDictionary from 'style-dictionary'
const { fileHeader } = StyleDictionary.formatHelpers
import fs from 'fs'
import _ from 'lodash'
import path from 'path'

//const fileHeader = StyleDictionary.formatHelpers.fileHeader
/* Custom function for web desktop dimensions */

const typographyKeyMap = {
  fontFamily: 'font-family',
  fontWeight: 'font-weight',
  fontSize: 'font-size',
  letterSpacing: 'letter-spacing',
  lineHeight: 'line-height',
  paragraphSpacing: 'margin-bottom',
  textCase: 'text-transform',
  textDecoration: 'text-decoration',
}
const fontWeightMap = {
  hairline: 1,
  thin: 100,
  extralight: 200,
  ultralight: 200,
  extraleicht: 200,
  light: 300,
  leicht: 300,
  normal: 400,
  regular: 400,
  buch: 400,
  medium: 500,
  kraeftig: 500,
  kräftig: 500,
  semibold: 600,
  demibold: 600,
  halbfett: 600,
  bold: 700,
  dreiviertelfett: 700,
  extrabold: 800,
  ultabold: 800,
  fett: 800,
  black: 900,
  heavy: 900,
  super: 900,
  extrafett: 900,
  ultra: 1000,
}

export function getUnit(value, token) {
  //return token.name.match("desktop") ? unit/16 + "vw" : unit + "px"
  value = parseFloat(value)
  if (token.name.match('desktop')) {
    return value / 16 + 'vw'
  } else if (token.name.match('mobile')) {
    return value / 4 + 'vw'
  } else {
    return value + 'px'
  }
}

export function getFontWeight(value) {
  //return token.name.match("desktop") ? unit/16 + "vw" : unit + "px"
  if (value && typeof value == 'string')
    return (
      fontWeightMap[
        value
          .toLowerCase()
          .replace('italic', '')
          .replace('oblique', '')
          .replace(' ', '')
      ] || 400
    )
  return value
}
export function getFontStyle(value) {
  if (value && typeof value == 'string') {
    if (value.toLowerCase().match('italic')) {
      return 'italic'
    } else if (value.toLowerCase().match('oblique')) {
      return 'oblique'
    } else {
      return 'normal'
    }
  }
  return 'normal'
}

/* Define Filters */
const __dirname = path.resolve(path.dirname('')); 
const formats = {
  'go/scss-map-flat': function({dictionary, options, file}) {
    const template = _.template(fs.readFileSync(__dirname + '/build/tokens/templates/scss-map-flat.template'));
    const { allTokens } = dictionary;
    return template({allTokens, file, options, fileHeader});
  },
  'go/android-resources': function ({ dictionary, options, file }) {
    const template = _.template(
      fs.readFileSync(
        path.join(__dirname, '/build/tokens/templates/android-resources.template'),
      ),
    )
    return template({ dictionary, file, options, fileHeader })
  },
  'go/ios-swift-any': function ({ dictionary, options, file, platform }) {
    const template = _.template(
      fs.readFileSync(
        path.join(__dirname, '/build/tokens/templates/ios-swift-class.template'),
      ),
    )
    const { outputReferences } = options
    options = StyleDictionary.formatHelpers.setSwiftFileProperties(
      options,
      'class',
      platform.transformGroup,
    )
    const formatProperty =
      StyleDictionary.formatHelpers.createPropertyFormatter({
        outputReferences,
        dictionary,
        formatting: {
          suffix: '',
        },
      })
    let allTokens
    if (outputReferences) {
      allTokens = [...dictionary.allTokens].sort(
        StyleDictionary.formatHelpers.sortByReference(dictionary),
      )
    } else {
      allTokens = [...dictionary.allTokens].sort(
        StyleDictionary.formatHelpers.sortByName,
      )
    }

    return template({ allTokens, file, options, formatProperty, fileHeader })
  },
}


const actions = {
  'go/assets': {
    do: function (dictionary, config) {
      console.log('Copying assets directory')
      fs.cpSync('assets', config.buildPath + 'assets', { recursive: true })
      renameFilesRecursively(
        config.buildPath + 'assets/icons',
        renameAndroidAssets,
      )
    },
    undo: function (dictionary, config) {
      console.log('Cleaning assets directory')
      fs.rmSync(
        config.buildPath + 'assets',
        { recursive: true },
        function (error) {
          console.log(error.message)
        },
      )
    },
  },
}

// Define your custom renaming function here
function renameAndroidAssets(oldFileName) {
  // Modify the oldFileName as needed to create the newFileName
  const newFileName = `new_${oldFileName}`
  return newFileName
}

// Function to recursively rename files in a directory according to the renaming function
function renameFilesRecursively(folderPath, renameFunction) {
  // Get a list of all items in the folder
  const items = fs.readdirSync(folderPath)

  items.forEach(item => {
    const itemPath = path.join(folderPath, item)
    const isDirectory = fs.statSync(itemPath).isDirectory()

    if (isDirectory) {
      // If it's a directory, recursively rename files inside it
      renameFilesRecursively(itemPath, renameFunction)
    } else {
      // If it's a file, apply the rename function
      const newName = renameFunction(item, folderPath)
      const newPath = path.join(folderPath, newName)

      // Rename the file
      fs.renameSync(itemPath, newPath)
      console.log(`Renamed: ${itemPath} -> ${newPath}`)
    }
  })
}

export { formats, actions }
