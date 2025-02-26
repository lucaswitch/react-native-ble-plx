const path = require('path')
const fs = require('fs')

const TEST_PROJECT_DIR_NAME = '../test_project'
const EXAMPLE_PROJECT_DIR_NAME = '../example'

const indexJsPath = path.join(__dirname, EXAMPLE_PROJECT_DIR_NAME, 'index.js')
const indexJsDestinationPath = path.join(__dirname, TEST_PROJECT_DIR_NAME, 'index.js')

const copyExampleProjectIndexJs = () => {
  console.info('Deleting index.js from test_project')
  fs.unlinkSync(indexJsDestinationPath)
  console.info('Copying index.js from example to test_project')
  fs.copyFileSync(indexJsPath, indexJsDestinationPath)
}

const jsSourceDirectory = path.join(__dirname, EXAMPLE_PROJECT_DIR_NAME, 'src')
const jsSourceDestinationDirectory = path.join(__dirname, TEST_PROJECT_DIR_NAME, 'src')

const copyExampleProjectJsFiles = () => {
  console.info('Copying src from example to test_project')
  fs.cpSync(jsSourceDirectory, jsSourceDestinationDirectory, { recursive: true })
}

const androidManifestDestinationPath = path.join(
  __dirname,
  TEST_PROJECT_DIR_NAME,
  'android',
  'app',
  'src',
  'main',
  'AndroidManifest.xml'
)
const manifestPermissions = [
  `<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />`,
  `<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />`,
  `<uses-permission android:name="android.permission.BLUETOOTH" android:maxSdkVersion="30" />`,
  `<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" android:maxSdkVersion="30" />`,
  `<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />`
]

const addAndroidManifestPermissions = () => {
  const destinationAndroidManifestLines = fs.readFileSync(androidManifestDestinationPath, 'utf8').split('\n')
  const indexOfManifestTagEndLine = destinationAndroidManifestLines.findIndex(line => line.includes('>'))

  console.info('Adding permissions to AndroidManifest.xml')
  const joinedPermissions = manifestPermissions.join('\n')
  destinationAndroidManifestLines.splice(indexOfManifestTagEndLine + 1, 0, joinedPermissions)

  console.info('Writing new AndroidManifest.xml to test_project')
  fs.writeFileSync(androidManifestDestinationPath, destinationAndroidManifestLines.join('\n'))
}

const packageJsonPath = path.join(__dirname, EXAMPLE_PROJECT_DIR_NAME, 'package.json')
const packageJsonDestinationPath = path.join(__dirname, TEST_PROJECT_DIR_NAME, 'package.json')

const addMissingDependencies = () => {
  const sourcePackageJson = require(packageJsonPath)
  const editedPackageJson = require(packageJsonDestinationPath)

  console.info('Checking for missing dependencies')
  const missingDependencies = Object.keys(sourcePackageJson.dependencies).filter(
    dependency => !editedPackageJson.dependencies[dependency]
  )
  const missingDevDependencies = Object.keys(sourcePackageJson.devDependencies).filter(
    dependency => !editedPackageJson.devDependencies[dependency]
  )

  missingDependencies.forEach(dependency => {
    editedPackageJson.dependencies[dependency] = sourcePackageJson.dependencies[dependency]
  })
  missingDevDependencies.forEach(dependency => {
    editedPackageJson.devDependencies[dependency] = sourcePackageJson.devDependencies[dependency]
  })

  console.info('Writing new package.json to test_project')
  fs.writeFileSync(packageJsonDestinationPath, JSON.stringify(editedPackageJson, null, 2) + '\n')
}

const metroDestinationPath = path.join(__dirname, TEST_PROJECT_DIR_NAME, 'metro.config.js')
const metroSourcePath = path.join(__dirname, EXAMPLE_PROJECT_DIR_NAME, 'metro.config.js')

const copyMetroConfig = () => {
  console.info('Deleting metro.config.js from test_project')
  fs.unlinkSync(metroDestinationPath)
  console.info('Copying metro.config.js from example to test_project')
  fs.copyFileSync(metroSourcePath, metroDestinationPath)
}

const reactNativeDestinationPath = path.join(__dirname, TEST_PROJECT_DIR_NAME, 'react-native.config.js')
const reactNativeSourcePath = path.join(__dirname, EXAMPLE_PROJECT_DIR_NAME, 'react-native.config.js')

const copyReactNativeConfig = () => {
  const doesDestinationFileExist = fs.existsSync(reactNativeDestinationPath)

  if (doesDestinationFileExist) {
    console.info('Deleting react-native.config.js from test_project')
    fs.unlinkSync(reactNativeDestinationPath)
  }

  console.info('Copying react-native.config.js from example to test_project')
  fs.copyFileSync(reactNativeSourcePath, reactNativeDestinationPath)
}

const babelConfigDestinationPath = path.join(__dirname, TEST_PROJECT_DIR_NAME, 'babel.config.js')
const babelConfigSourcePath = path.join(__dirname, EXAMPLE_PROJECT_DIR_NAME, 'babel.config.js')

const copyBabelConfig = () => {
  console.info('Deleting babel.config.js from test_project')
  fs.unlinkSync(babelConfigDestinationPath)
  console.info('Copying babel.config.js from example to test_project')
  fs.copyFileSync(babelConfigSourcePath, babelConfigDestinationPath)
}

const changePackageJsonName = () => {
  const packageJson = require(packageJsonDestinationPath)

  packageJson.name = 'test_project'
  fs.writeFileSync(packageJsonDestinationPath, JSON.stringify(packageJson, null, 2) + '\n')
}

const setMinSdkVersion = () => {
  const gradlePath = path.join(__dirname, TEST_PROJECT_DIR_NAME, 'android', 'app', 'build.gradle')
  const gradleLines = fs.readFileSync(gradlePath, 'utf8').split('\n')
  const indexOfManifestTagEndLine = gradleLines.findIndex(line => line.includes('minSdkVersion'))
  gradleLines[indexOfManifestTagEndLine] = 'minSdkVersion 23'
  fs.writeFileSync(gradlePath, gradleLines.join('\n'))
}

const copyExampleProjectFiles = () => {
  copyExampleProjectIndexJs()
  copyExampleProjectJsFiles()
  addAndroidManifestPermissions()
  addMissingDependencies()
  copyMetroConfig()
  copyReactNativeConfig()
  copyBabelConfig()
  changePackageJsonName()
  setMinSdkVersion()
}

copyExampleProjectFiles()
