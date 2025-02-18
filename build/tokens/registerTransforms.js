import { checkAndEvaluateMath, transformColorModifiers } from '@tokens-studio/sd-transforms'
import { getFontWeight, getUnit, getFontStyle } from './utils.js'
import { filters } from './registerFilters.js'
import Color from 'tinycolor2'

export default function (StyleDictionary) {
  StyleDictionary.registerTransform({
    name: 'go/resolveMath',
    type: 'value',
    transitive: true,
    matcher: token => typeof (token.$value ?? token.value) === 'string',
    transformer: token => checkAndEvaluateMath(token.$value ?? token.value),
  })

  StyleDictionary.registerTransform({
    name: 'ts/color/modifiers',
    type: 'value',
    transitive: true,
    matcher: token =>
      (token.$type ?? token.type) === 'color' &&
      token.$extensions &&
      token.$extensions['studio.tokens']?.modify,
    transformer: token =>
      transformColorModifiers(token, {
        format: 'hex',
      }),
  })

  StyleDictionary.registerTransform({
    name: 'go/color/ios',
    type: 'value',
    transitive: true,
    matcher: filters['go/color'],
    transformer: function (token, options) {
      const { r, g, b, a } = Color(token.value).toRgb()
      const rFixed = (r / 255.0).toFixed(3)
      const gFixed = (g / 255.0).toFixed(3)
      const bFixed = (b / 255.0).toFixed(3)
      return `UIColor(red: ${rFixed}, green: ${gFixed}, blue: ${bFixed}, alpha: ${a})`
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/number/ios',
    type: 'value',
    transitive: true,
    matcher: filters['go/number'],
    transformer: function (token, options) {
      const value = parseFloat(token.value)
      if (isNaN(value))
        throw new Error(
          `Invalid Number: '${token.name}: ${token.value}' is not a valid number.`,
        )
      return `CGFloat(${value})`
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/string/ios',
    type: 'value',
    transitive: true,
    matcher: filters['go/string'],
    transformer: function (token, options) {
      const value = String(token.value)
      const commaIndex = value.indexOf(',');
      if (token.type == 'fontFamilies' && commaIndex !== -1) {
          return `"${value.substring(0, commaIndex)}"`;
      }
      return `"${value}"`
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/gradient/ios',
    type: 'value',
    transitive: true,
    matcher: filters['go/gradient'],
    transformer: function (token, options) {
      return `GRADIENT: ${token.value}`
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/typography/ios',
    type: 'value',
    transitive: true,
    matcher: filters['go/typography'],
    transformer: function (token, options) {
      return `TYPOGRAPHY: ${token.value}`
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/color/android',
    type: 'value',
    transitive: true,
    matcher: filters['go/color'],
    transformer: function (token, options) {
      const str = Color(token.value).toHex8()
      return '#' + str.slice(6) + str.slice(0, 6)
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/number/android',
    type: 'value',
    transitive: true,
    matcher: filters['go/number'],
    transformer: function (token, options) {
      const value = parseFloat(token.value)
      if (isNaN(value))
        throw new Error(
          `Invalid Number: '${token.name}: ${token.value}' is not a valid number.`,
        )
      //return `CGFloat(${value})`
      return `${value}${token.type === 'fontSizes' ? 'sp' : 'dp'}`
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/string/android',
    type: 'value',
    transitive: true,
    matcher: filters['go/string'],
    transformer: function (token, options) {
      const value = String(token.value)
      const commaIndex = value.indexOf(',') || 0;
      if (token.type == 'fontFamilies' && commaIndex !== -1) {
          return value.substring(0, commaIndex);
      }
      return `${value}`
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/size/web',
    type: 'value',
    transitive: true,
    matcher: filters['go/size'],
    transformer: function (token, options) {
      const values = token.value.split(' ')
      return values
        .map(value => {
          //eval(value) + 'px'
          let size = value
          if (value.includes('*')) {
            size = value.split('*')[0]
          }
          if (value.includes('+')) {
            size = value.split('+')[0]
          }

          let unit
          if (size.endsWith('rem')) {
            unit = 'rem'
          } else if (size.endsWith('vw')) {
            unit = 'vw'
          } else {
            unit = 'px'
          }

          const val = eval(value.replace(/[a-zA-Z]+/g, ''))
          if (isNaN(val)) {
            throw new Error(
              `Invalid Number: '${token.name}: ${token.value}' is not a valid number, cannot transform to '${unit}'.`,
            )
          }
          return val + unit
        })
        .join(' ')
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/size/vw',
    type: 'value',
    transitive: true,
    matcher: filters['go/size'],
    transformer: function (token, options) {
      if (typeof token.value !== 'object') {
        const values = String(token.value).replace(/[a-zA-Z]+/g, '').split(' ')
        return values.map(value => eval(value) / options.basePxFontSize + 'vw').join(' ')
      }
      const value = String(token.value).replace(/[a-zA-Z]+/g, '')
      if (isNaN(value))
        throw new Error(
          `Invalid Number: '${token.name}: ${token.value}' is not a valid number, cannot transform to 'vw'.`,
        )
      return value / options.basePxFontSize + 'vw'
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/size/rem',
    type: 'value',
    transitive: false,
    matcher: filters['go/size'],
    transformer: function (token, options) {
      if (typeof token.value !== 'object') {
        const values = String(token.value).replace(/[a-zA-Z]+/g, '').split(' ')
        return values.map(value => eval(value) / options.basePxFontSize + 'rem').join(' ')
      }
      const value = String(token.value).replace(/[a-zA-Z]+/g, '')
      if (isNaN(value))
        throw new Error(
          `Invalid Number: '${token.name}: ${token.value}' is not a valid number, cannot transform to 'rem'.`,
        )
      return eval(value) / options.basePxFontSize + 'rem'
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/size/px',
    type: 'value',
    transitive: true,
    matcher: filters['go/size'],
    transformer: function (token, options) {
      if (typeof token.value !== 'object') {
        const values = String(token.value).replace(/[a-zA-Z]+/g, '').split(' ')
        return values.map(value => eval(value) + 'px').join(' ')
      }
      const value = String(token.value).replace(/[a-zA-Z]+/g, '')
      if (isNaN(value))
        throw new Error(
          `Invalid Number: '${token.name}: ${token.value}' is not a valid number, cannot transform to 'px'.`,
        )
      return value + 'px'
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/number/web',
    type: 'value',
    transitive: true,
    matcher: filters['go/opacity'],
    transformer: function (token, options) {
      const value = parseFloat(token.value)
      if (isNaN(value))
        throw new Error(
          `Invalid Number: '${token.name}: ${token.value}' is not a valid number.`,
        )
      return value
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/typography/web',
    type: 'value',
    transitive: true,
    matcher: filters['go/typography'],
    transformer: function (token, options) {
      if (typeof token.value !== 'object') {
        switch (token.type) {
          case 'fontWeights':
            return getFontWeight(token.value)
          // case 'fontSizes':
          // case 'letterSpacing':
          // case 'lineHeights':
          //   return parseFloat(token.value)
          // case 'paragraphSpacing':
          //   return parseFloat(token.value) + "rem"
          default:
            return token.value
        }
      }

      return '('+[
        `"font-family": ${token.value.fontFamily}`,
        `"font-weight": ${getFontWeight(token.value.fontWeight)}`,
        `"font-size": ${token.value.fontSize}`,
        `"font-style": ${getFontStyle(token.value.fontWeight)}`,
        `"letter-spacing": ${token.value.letterSpacing}`,
        `"line-height": ${parseFloat(token.value.lineHeight)}`,
        `"paragraph-spacing": ${token.value.paragraphSpacing}`,
        `"text-transform": ${token.value.textCase}`,
        `"text-decoration": ${token.value.textDecoration}`,
      ].join(', ')+')'
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/shadow/web',
    type: 'value',
    transitive: true,
    matcher: filters['go/shadow'],
    transformer: function (token, options) {
      if (typeof token.value !== 'object') {
        return token.value
      }
      // allow both single and multi shadow tokens
      const shadow = Array.isArray(token.value) ? token.value : [token.value]
      const value = shadow.map(s => {
        const { x, y, blur, color, spread, type } = s
        //let {r,g,b,a} = Color(color).toRgb()
        //let rgba = `rgba(${r}, ${g}, ${b}, ${a})`
        // support inset shadows as well
        return `${x} ${y} ${blur} ${spread} ${color}${
          type === 'innerShadow' ? ' inset' : ''
        }`
      })
      return `${value.join(', ')}`
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/shadow/scss',
    type: 'value',
    transitive: true,
    matcher: filters['go/shadow'],
    transformer: function (token, options) {
      if (typeof token.value !== 'object') {
        return token.value
      }
      // allow both single and multi shadow tokens
      const shadow = Array.isArray(token.value) ? token.value : [token.value]
      const value = shadow.map((s, i) => {
        const { x, y, blur, color, spread, type } = s
        //let {r,g,b,a} = Color(color).toRgb()
        //let rgba = `rgba(${r}, ${g}, ${b}, ${a})`
        // support inset shadows as well
        return `("${i}": ("x": ${x}, "y": ${y}, "blur": ${blur}, "spread": ${spread}, "color": ${color}, "type": ${
          type === 'innerShadow' ? 'inset' : null}))`
      })
      return `${value.join(', ')}`
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/border/web',
    type: 'value',
    transitive: true,
    matcher: filters['go/border'],
    transformer: function (token, options) {
      if (typeof token.value !== 'object') {
        return token.value
      }
      const values = token.value.split(' ')
      console.log(values)
      const { color, width } = token.value
      const { style } = token.value
      return `${width || ''} ${style || ''} ${color || ''}`.trim()
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/icon/web',
    type: 'value',
    transitive: true,
    matcher: filters['go/icon'],
    transformer: function (token) {
      return `url(${token.value})`
    },
  })

  StyleDictionary.registerTransform({
    name: 'go/color/web',
    type: 'value',
    transitive: true,
    matcher: filters['go/color'],
    transformer: function (token, options) {
      const { r, g, b, a } = Color(token.value).toRgb()
      //const rFixed = (r / 255.0).toFixed(3)
      //const gFixed = (g / 255.0).toFixed(3)
      //const bFixed = (b / 255.0).toFixed(3)
      const aFixed = a.toFixed(2)
      return `rgba(${r},${g},${b},${aFixed})`
    },
  })

}
