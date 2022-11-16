import puppeteer from 'puppeteer'
import fs from 'fs'

async function getDailyEvents() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const noneID = '#fe_none'
  const campusEventID = '#catID_19'
  const eventsID = '#events > ul > li'

  await page.goto('https://calendar.fresnostate.edu/')
  await page.waitForSelector(noneID)
  await page.click(noneID)
  await page.waitForSelector(campusEventID)
  await page.click(campusEventID)
  await page.waitForSelector(eventsID)

  const listOfHTMLTags = await page.evaluate((ID) => {
    const convertDate = (date) => {
      const [year, month, day] = date.split('-')
      const result = [month, day, year].join('/')
      return result
    }
    return [...document.querySelectorAll(ID)].map((tags) => {
      const date = new Date(tags.children[0].attributes.item(1).value)
        .toISOString()
        .split('T')[0]
      const formattedDate = convertDate(date)
      return {
        time: formattedDate,
        link: tags.children[1].attributes.item(1).value,
        title: tags.children[1].children[0].innerText,
      }
    })
  }, eventsID)

  await browser.close()
  return listOfHTMLTags
}

function filterDailyEvents(updatedTags) {
  for (let i = 0; i < updatedTags.length - 1; i++) {
    for (let j = i + 1; j < updatedTags.length - 1; j++) {
      if (updatedTags[i].title === updatedTags[j].title) {
        updatedTags.splice(j, 1)
        j--
      }
    }
  }
  return updatedTags.slice(0, 10)
}

function createHTMLTags(filteredTag) {
  return `<li><div class="date">${filteredTag.time}</div><a\nhref="${filteredTag.link}">${filteredTag.title}</a></li>`
}

async function main() {
  const dailyEvents = await getDailyEvents()
  const filteredTags = filterDailyEvents(dailyEvents)
  const HTMLTags = filteredTags.map((tag) => {
    return createHTMLTags(tag)
  })
  await fs.writeFile('bruh.txt', '', (err) => {
    if (err) throw err
  })
  for (let i = 0; i < HTMLTags.length; i++) {
    await fs.appendFile('bruh.txt', HTMLTags[i] + '\n', (err) => {
      if (err) throw err
    })
  }
}

main()
