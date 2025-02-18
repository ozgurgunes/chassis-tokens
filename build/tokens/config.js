//import { options } from "style-dictionary";

export default function (name) {
  var file = name.replace('_base', '')
  return {
    name,
    platforms: {
      web: {
        basePxFontSize: 16,
        prefix: "cx",
        buildPath: 'dist/tokens/web/',
        transformGroup: 'go/web',
        files: [
          {
            destination: `${file}.scss`,
            filter: 'go/common',
            format: 'go/scss-map-flat',
            options: {
              fileHeader: 'goFileHeader',
              outputReferences: true,
              themeable: true
            }
          }
        ]
      },
      android: {
        basePxFontSize: 1,
        prefix: "cx",
        buildPath: `dist/tokens/android/${file}/`,
        transformGroup: 'go/android',
        files: [
          {
            destination: 'allTokens.xml',
            filter: 'go/common',
            format: 'go/android-resources',
            options: {
              fileHeader: 'goFileHeader',
              outputReferences: false,
              themeable: true
            }
          },
          {
            destination: 'colorTokens.xml',
            filter: 'go/color',
            format: 'go/android-resources',
            options: {
              fileHeader: 'goFileHeader',
              outputReferences: false,
              themeable: true
            }
          },
          {
            destination: 'numberTokens.xml',
            filter: 'go/number',
            format: 'go/android-resources',
            options: {
              fileHeader: 'goFileHeader',
              outputReferences: false,
              themeable: true
            }
          },
          {
            destination: 'stringTokens.xml',
            filter: 'go/string',
            format: 'go/android-resources',
            options: {
              fileHeader: 'goFileHeader',
              outputReferences: false,
              themeable: true
            }
          }
        ]
      },
      'ios': {
        basePxFontSize: 1,
        // prefix: "cx",
        buildPath: `dist/tokens/ios/${file}/`,
        transformGroup: 'go/ios',
        files: [
          {
            destination: 'allTokens.swift',
            filter: 'go/common',
            format: 'go/ios-swift-any',
            className: 'AllTokens:NSObject',
            options: {
              import: ['UIKit'],
              fileHeader: 'goFileHeader',
              outputReferences: false,
              themeable: true
            }
          },
          {
            destination: 'colorTokens.swift',
            filter: 'go/color',
            format: 'go/ios-swift-any',
            className: 'ColorTokens:NSObject',
            options: {
              import: ['UIKit'],
              fileHeader: 'goFileHeader',
              outputReferences: false,
              themeable: true
            },
          },
          {
            destination: 'numberTokens.swift',
            filter: 'go/number',
            format: 'go/ios-swift-any',
            className: 'NumberTokens:NSObject',
            options: {
              import: ['UIKit'],
              fileHeader: 'goFileHeader',
              outputReferences: false,
              themeable: true
            }
          },
          {
            destination: 'stringTokens.swift',
            filter: 'go/string',
            format: 'go/ios-swift-any',
            className: 'StringTokens:NSObject',
            options: {
              import: ['UIKit'],
              fileHeader: 'goFileHeader',
              outputReferences: false,
              themeable: true
            }
          }
        ]
      }
    }
  }
}
