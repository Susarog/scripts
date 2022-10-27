const fs = require('fs')
const { parse } = require('csv-parse')
const { stringify } = require('csv-stringify')

function read(filePath, to) {
  const user = []
  return new Promise((resolve, reject) => {
    const userStream = fs.createReadStream(filePath)
    userStream
      .pipe(parse({ delimiter: ',', to_line: to, trim: true }))
      .on('error', (error) => {
        reject(error)
      })
      .on('data', (row) => {
        user.push(row)
      })
      .on('end', function () {
        resolve(user)
      })
  })
}

async function filter(neverLoggedInArray, specificGroupArray) {
  try {
    const result = neverLoggedInArray.filter((row) => {
      const firstName = row[2]
      const lastName = row[3]
      return !specificGroupArray.some((element) => {
        return element[1] === firstName && element[0] === lastName
      })
    })
    return result
  } catch (error) {
    console.error(error.message)
  }
}

async function write(filteredCSV, file, filePath) {
  const stream = fs.createWriteStream(filePath)
  const stringifier = stringify({ delimiter: ',' })
  const response = await read(file, 1)
  const newArr = response.concat(filteredCSV)
  newArr.forEach((element) => {
    stringifier.write(element)
  })
  stringifier.pipe(stream)
  console.log('finished')
}

async function output(neverLoggedInFilePath, specificGroupFilePath, year) {
  const neverLoggedInArray = await read(neverLoggedInFilePath, null)
  const specificGroupArray = await read(specificGroupFilePath, null)
  const result = await filter(specificGroupArray, neverLoggedInArray)

  write(
    result,
    specificGroupFilePath,
    `${specificGroupFilePath.slice(
      0,
      specificGroupFilePath.length - 4
    )} ${year}.csv`
  )
}

output(process.argv[2], process.argv[3], process.argv[4])
