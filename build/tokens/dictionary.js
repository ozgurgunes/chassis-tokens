import { transformColorModifiers } from '@tokens-studio/sd-transforms'
import registerFilters from './registerFilters.js'
import registerTransforms from './registerTransforms.js'
import { formats, actions } from './utils.js'

export default function registerDictionary(StyleDictionary) {
  registerFilters(StyleDictionary)
  registerTransforms(StyleDictionary)

  StyleDictionary.registerFormat({
    name: 'go/android-resources',
    formatter: formats['go/android-resources'],
  })

  StyleDictionary.registerFormat({
    name: 'go/ios-swift-any',
    formatter: formats['go/ios-swift-any'],
  })

  StyleDictionary.registerFormat({
    name: 'go/scss-map-flat',
    formatter: formats['go/scss-map-flat'],
  })

  StyleDictionary.registerFileHeader({
    name: 'goFileHeader',
    fileHeader: (defaultMessage) => {
      // defaultMessage are the 2 lines above that appear in the default file header
      // you can use this to add a message before or after the default message 👇

      // the fileHeader function should return an array of strings
      // which will be formatted in the proper comment style for a given format
      return [
        ...defaultMessage,
        `Chassis - Tokens v0.1.0`,
        `Copyright 2025 Ozgur Gunes`,
        `Licensed under MIT (https://github.com/ozgurgunes/chassis-tokens/blob/main/LICENSE)`,
      ]
    }
  });

  /* Register Transform Groups */

  StyleDictionary.registerTransformGroup({
    name: 'go/web',
    transforms: [
      'attribute/cti',
      'name/cti/kebab',
      //'size/px',
      'ts/color/modifiers',
      //'go/resolveMath',
      'color/css',
      // 'go/color/web',

      'go/size/rem',
      'go/icon/web',
      'go/number/web',
      'go/typography/web',
      'go/shadow/web',
    ],
  })

  StyleDictionary.registerTransformGroup({
    name: 'go/ios',
    transforms: [
      'attribute/cti',
      'name/cti/pascal',
      // 'color/UIColorSwift',
      // 'content/swift/literal',
      // 'asset/swift/literal',
      // 'size/swift/remToCGFloat',
      // 'font/swift/literal',

      'go/color/ios',
      'go/string/ios',
      'go/number/ios',
    ],
  })

  StyleDictionary.registerTransformGroup({
    name: 'go/android',
    transforms: [
      'attribute/cti',
      'name/cti/snake',
      // 'color/hex8android',
      // 'size/remToSp',
      // 'size/remToDp',

      'go/color/android',
      'go/string/android',
      'go/number/android',
    ],
  })

  StyleDictionary.registerAction({
    name: 'go/assets',
    do: actions['go/assets'].do,
    undo: actions['go/assets'].undo,
  })
}
