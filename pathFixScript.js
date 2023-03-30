const childProcess = require('child_process')
const fs = require('fs')
const readline = require('readline')

async function processLineByLine(path) {
  const fileStream = fs.createReadStream(path)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })

  const deep = path.split('/').length - 1
  const lines = []
  const file = []
  for await (let line of rl) {
    if (
      line.match(/ from '@/) ||
      line.match(/@import '/) ||
      line.includes("require('@/assets") ||
      line.includes('~/src/@core')
    ) {
      if (line.match(/@(casl|fullcalendar|vueuse)/)) {
        file.push(line)
      } else if (line.includes('@/')) {
        const [alias] = line.match(/@[^/,import]*/)
        lines.push(line)
        const newL = line.replace(`${alias}/`, '../'.repeat(deep - 1))
        lines.push(newL)
        file.push(newL)
      } else if (line.includes('~/src/@core')) {
        lines.push(line)
        const newL = line.replace(`~/src/`, '../'.repeat(deep - 1))
        lines.push(newL)
        file.push(newL)
      } else if (line.includes("@import '~")) {
        const [alias] = line.match(/@[^/]*/)
        const NewAlias = String(alias).replace("@import '~", '')
        lines.push(line)
        const newL = line.replace(`~${NewAlias}/`, '../'.repeat(deep - 1) + NewAlias + '/')
        lines.push(newL)
        file.push(newL)
      } else {
        const [alias] = line.match(/@[^/,import]*/)
        lines.push(line)
        const newL = line.replace(`${alias}/`, '../'.repeat(deep - 1) + alias + '/')
        lines.push(newL)
        file.push(newL)
      }
    } else {
      file.push(line)
    }
  }

  if (lines.length > 0) {
    console.log('\x1b[32m%s\x1b[0m', path)
    console.log('\x1b[32m%s\x1b[0m', `deep: ${deep}`)
    console.log(lines.join('\n'))
  }

  fs.writeFileSync(path, file.join('\n') + '\n')
}

const basePath = 'src'
function findFiles(ext) {
  childProcess.exec(`cd ${basePath}; find . -path "*.${ext}"`, async (err, stdout) => {
    if (err) {
      console.log('\x1b[31m%s\x1b[0m', `${ext}: 0`)
      return
    }

    const list = stdout
      .split('\n')
      .filter((item) => {
        return !!item
      })
      .map((item) => {
        // console.log(item)
        processLineByLine(`${basePath}${item.substring(1)}`)
      })
  })
}

;['vue', 'js', 'ts'].forEach((item) => {
  findFiles(item)
})
