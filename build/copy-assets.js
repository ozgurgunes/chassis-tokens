import fs from 'fs'
import path from 'path'

const brands = ['chassis', 'test']
const BRAND_DEFAULT = 'default'
const apps = {
  docs: ['web'],
  test: ['ios', 'android'],
}

// Function to recursively rename files in a directory according to the renaming function
export function renameFilesRecursively(folderPath, renameFunction) {
  const items = fs.readdirSync(folderPath)

  items.forEach(item => {
    const itemPath = path.join(folderPath, item)
    const isDirectory = fs.statSync(itemPath).isDirectory()

    if (isDirectory) {
      renameFilesRecursively(itemPath, renameFunction)
    } else {
      const newName = renameFunction(item, folderPath)
      const newPath = path.join(folderPath, newName)
      fs.renameSync(itemPath, newPath)
      console.log(`Renamed: ${newPath}`)
    }
  })
}

// Function to recursively copy files from source to destination
function copyFilesRecursively(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Source path does not exist: ${src}`)
    return
  }

  const items = fs.readdirSync(src)

  items.forEach(item => {
    const srcPath = path.join(src, item)
    const destPath = path.join(dest, item)
    const isDirectory = fs.statSync(srcPath).isDirectory()

    if (isDirectory) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true })
      }
      copyFilesRecursively(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
      console.log(`Copied: ${srcPath}`)
    }
  })
}

export async function generateAsssets() {
  try {
    console.log('Copying assets...')
    brands.forEach(brand => {
      Object.entries(apps).forEach(([app, platforms]) => {
        platforms.forEach(platform => {
          const destPath = `dist/assets/${brand}/${app}-${platform}`

          if (fs.existsSync(destPath)) {
            fs.rmSync(destPath, { recursive: true })
          }

          console.log(`\nProcessing: ${brand} - ${app} - ${platform}`)
          console.log(`=============================================`)

          fs.mkdirSync(destPath, { recursive: true })

          // Copy default brand files
          copyFilesRecursively(`assets/${BRAND_DEFAULT}/${app}`, destPath)

          // Override with specific brand files if they exist
          const brandAppPath = `assets/${brand}/${app}`
          if (fs.existsSync(brandAppPath)) {
            copyFilesRecursively(brandAppPath, destPath)
          }

          // Rename files for Android
          if (platform === 'android') {
            renameFilesRecursively(destPath, fileName =>
              fileName.toLowerCase().replaceAll('-', '_')
            )
            const iconsPath = `${destPath}/icons`
            if (!fs.existsSync(iconsPath)) {
              fs.mkdirSync(iconsPath, { recursive: true })
            }
            renameFilesRecursively(iconsPath, fileName => `ic_${fileName}`)
          }
        })
      })
    })

    console.log('\nAssets copied!\n')
  } catch (error) {
    console.error('Error during asset generation:', error)
  }
}

generateAsssets()
