export default function(themes, { separator = '_' } = {}) {
  if (themes.some(theme => theme.group)) {
    // Sort themes by groups
    const groups = {}
    themes.forEach(theme => {
      if (theme.group) {
        groups[theme.group] = [...(groups[theme.group] ?? []), theme]
      } else {
        throw new Error(
          `Theme ${theme.name} does not have a group property, which is required for multi-dimensional theming.`
        )
      }
    })

    if (Object.keys(groups).length <= 1) {
      return mapThemesToSetsObject(themes)
    }

    // Create theme permutations
    const permutations = cartesian(Object.values(groups))

    return Object.fromEntries(
      permutations.map(perm => {
        // 1) concat the names of the theme groups to create the permutation theme name
        // 2) merge the selectedTokenSets together from the different theme group parts
        const reduced = perm.reduce(
          (acc, curr) => [
            `${acc[0]}${acc[0] ? separator : ''}${curr.name}`,
            [...acc[1], ...filterSources(curr.selectedTokenSets)],
            [...acc[2], ...filterIncludes(curr.selectedTokenSets)]
          ],
          ['', [], []]
        )
        // Dedupe the tokensets, return as entries [name, sets]
        return [
          reduced[0],
          {
            sets: [...new Set(reduced[1].concat(reduced[2]))],
            excludes: [
              ...new Set(reduced[2].filter(item => !reduced[1].includes(item)))
            ]
          }
        ]
      })
    )
  } else {
    return mapThemesToSetsObject(themes)
  }
}

function filterIncludes(tokensets) {
  return Object.entries(tokensets)
    .filter(([, val]) => val === 'source')
    .map(entry => entry[0])
}

function filterSources(tokensets) {
  return Object.entries(tokensets)
    .filter(([, val]) => val === 'enabled')
    .map(entry => entry[0])
}

function mapThemesToSetsObject(themes) {
  return Object.fromEntries(
    themes.map(theme => [
      theme.name,
      {
        sets: filterSources(theme.selectedTokenSets),
        excludes: filterIncludes(theme.selectedTokenSets)
      }
    ])
  )
}

// cartesian permutations: [[1,2], [3,4]] -> [[1,3], [1,4], [2,3], [2,4]]
function cartesian(a) {
  return a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())))
}