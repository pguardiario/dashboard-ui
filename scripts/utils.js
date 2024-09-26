const fs = require('fs')
const csvWriter = require('csv-write-stream')
const csv = require('csvtojson')

const writer = csvWriter()
let outputFile

let csvs = {}
function save(item, fn = 'output.csv') {
  if (csvs[fn] === undefined) {
    csvs[fn] = csvWriter()
    csvs[fn].pipe(fs.createWriteStream(fn))
  }
  csvs[fn].write(item)
}

const _visited = new Set()
const visited = (str) => {
  if(_visited.has(str)) return true
  _visited.add(str)
  return false
}

const load = path => csv().fromFile(path)

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const download = async (url, filename) => {
  if(!fs.existsSync(filename)){
    let buffer = await fetch(url).then(r => r.arrayBuffer())
    fs.writeFileSync(filename, Buffer.from(buffer))
  }
}

async function fetchWithRetries(url, retries = 3) {
  if (retries < 0) throw new Error("No more retries")
  try {
    let r = await fetch(url)
    let status = r.status
    if (status === 200) {
      return r
    } else {
      throw new Error(`bad status ${status} for ${url}`)
    }
  } catch (e) {
    console.log(e.message)
    return await fetchWithRetries(url, retries - 1)
  }
}

module.exports = { save, visited, load, delay, download, fetchWithRetries }

// npm i -s csv-write-stream csvtojson