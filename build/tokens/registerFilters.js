export default function (StyleDictionary) {
  StyleDictionary.registerFilter({
    name: 'go/typography',
    matcher: filters['go/typography'],
  })

  StyleDictionary.registerFilter({
    name: 'go/color',
    matcher: filters['go/color'],
  })

  StyleDictionary.registerFilter({
    name: 'go/shadow',
    matcher: filters['go/shadow'],
  })

  StyleDictionary.registerFilter({
    name: 'go/size',
    matcher: filters['go/size'],
  })

  StyleDictionary.registerFilter({
    name: 'go/number',
    matcher: filters['go/number'],
  })

  StyleDictionary.registerFilter({
    name: 'go/opacity',
    matcher: filters['go/opacity'],
  })

  StyleDictionary.registerFilter({
    name: 'go/gradient',
    matcher: filters['go/gradient'],
  })

  StyleDictionary.registerFilter({
    name: 'go/string',
    matcher: filters['go/string'],
  })

  StyleDictionary.registerFilter({
    name: 'go/icon',
    matcher: filters['go/icon'],
  })

  StyleDictionary.registerFilter({
    name: 'go/common',
    matcher: filters['go/common'],
  })

}

export const filters = {
  'go/size': token => propTypes.size.includes(token.type), // && token.attributes.category != 'effect',
  'go/opacity': token => token.type === 'opacity',
  'go/string': token => propTypes.string.includes(token.type), // || typeof token.value === 'string',
  'go/number': token => token.type === 'opacity' || propTypes.size.includes(token.type),
  'go/typography': token => propTypes.typography.includes(token.type),
  'go/border': token => token.type === 'border',
  'go/shadow': token =>
    propTypes.shadow.includes(token.type) ||
    token.attributes.category == 'shadow',
  'go/icon': token =>
    token.attributes.category == 'icon' && token.type == 'asset',
  'go/gradient': token =>
    ['gradient'].includes(token.attributes.category) && token.type === 'color',
  'go/color': token =>
    token.type === 'color' &&
    !['gradient', 'effect'].includes(token.attributes.category),
  'go/common': token => {
    //if (token.attributes.category == 'effect') {
    //  console.log(token)
    //}
    //return true
    return (
      filters['go/size'](token) ||
      filters['go/color'](token) ||
      filters['go/typography'](token) ||
      filters['go/shadow'](token) ||
      filters['go/gradient'](token) ||
      filters['go/number'](token) ||
      filters['go/icon'](token) ||
      filters['go/string'](token)
    )
  },
}

const propTypes = {
  //size: ['sizing', 'spacing', 'border', 'borderWidth', 'borderRadius'],
  typography: [
    'fontFamilies',
    'fontWeights',
    'fontSizes',
    'letterSpacing',
    'lineHeights',
    'paragraphSpacing',
    'typography',
    'textCase',
    'textDecoration',
  ],
  size: [
    'fontSizes',
    'letterSpacing',
    'lineHeights',
    'paragraphSpacing',
    'dimension',
    'sizing',
    'spacing',
    'borderRadius',
    'borderWidth',
    'blur',
    'spread',
    'x',
    'y',
  ],
  // string: ['string', 'asset'],
  string : [
    'fontFamily',
    'fontFamilies',
    'textDecoration',
    'textDecorations',
    'textCase',
    'textCases',
    'textDecoration',
    'textDecorations',
    'typography',
    'fontWeight', 
    'fontWeights',
    'typography',
    'asset',
    'text'
  ],
  shadow: ['blur', 'spread', 'x','y','type'],
  gradient: ['color', 'gradient'],
  border: ['border', 'borderWidth', 'borderRadius'],
}

