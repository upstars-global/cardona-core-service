const fs = require('fs')
const path = require('path')

const tsConfigJSON = require('./tsconfig.json')

const MAKE_LOG = false

const args = process.argv.slice(2) /// arguments path where will run script
const startingDirectory = args.length > 0 ? args[0] : process.cwd()

const EXCLUDED_DIRECTORIES = [
  'node_modules',
  'public',
  'dist',
  '@core',
  'apps',
  'routes',
  'views',
  'navigation',
  'auth',
  '@fake-db',
]

const EXCLUDED_CONFIG_JS_FILES = ['jest', 'vue', 'style', 'postcss', 'babel', '.eslint'].map(
  (fileName) => `${fileName}.config.js`
)

const EXCLUDED_FILES = ['clear-excess-js-files.js']

const EXCLUDED_PATHS_FROM_TS_CONFIG = tsConfigJSON.typedocOptions.entryPoints.map((path) =>
  path.replace('.ts', '.js')
)

const EXCLUDED_FILE_PATHS = [
  ...EXCLUDED_CONFIG_JS_FILES,
  ...EXCLUDED_PATHS_FROM_TS_CONFIG,
  'src/router/index.js',
  'src/router/index.js',
  'src/store/app/index.js',
  'src/store/app-config-core/index.js',
  'src/navigation/vertical/index.js',
]

const deletedFilesLog = []

const createLog = (logFilePath, logData) => {
  fs.writeFileSync(logFilePath, logData, { flag: 'w' }) // flag 'w' overwrites the log
}

const isFileTypeForDelete = (file) => ['.js', '.map'].some((type) => type === path.extname(file))

const isExcludedFile = (filePath) => {
  return (
    !EXCLUDED_FILES.includes(path.basename(filePath)) &&
    isFileTypeForDelete(filePath) &&
    !EXCLUDED_FILE_PATHS.some((excludeFilePath) => filePath.includes(excludeFilePath))
  )
}

const deleteJsFilesWithExceptions = (directory) => {
  const files = fs.readdirSync(directory)

  files.forEach((file) => {
    const filePath = path.join(directory, file)
    const fileStat = fs.statSync(filePath)

    if (fileStat.isDirectory()) {
      if (!EXCLUDED_DIRECTORIES.includes(file)) {
        deleteJsFilesWithExceptions(filePath)
      }
    } else {
      if (isExcludedFile(filePath)) {
        deletedFilesLog.push({ fileName: file, filePath })
        fs.unlinkSync(filePath)
      }
    }
  })
}

deleteJsFilesWithExceptions(startingDirectory)

if (MAKE_LOG && deletedFilesLog.length > 0) {
  const logData = deletedFilesLog.map(
    (entry) => `Файл: ${entry.fileName}, Путь: ${entry.filePath}\n`
  )
  const logFilePath = 'deleted_files_log.txt' // Укажите путь и имя файла лога
  createLog(logFilePath, logData.join(''))
}
