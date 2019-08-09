const openPage = require('./openPage')
const scrapSection = require('./scrapSection')
const scrollToPageBottom = require('./scrollToPageBottom')
const seeMoreButtons = require('./seeMoreButtons')
const template = require('./profileScraperTemplate')
const cleanProfileData = require('./cleanProfileData')

const logger = require('./logger')

module.exports = async (browser, url, waitTimeToScrapMs = 500) => {
  logger.info('[PROFILE SCAN]', `STARTING PROFILE USER: ${url}`)

  const page = await openPage(browser, url)
  const profilePageIndicatorSelector = ".pv-profile-section"
  
  await page.waitFor(profilePageIndicatorSelector, { timeout: 5000 })
    .catch(() => {
      logger.warn('[LINKEDIN RESPONSE]', 'PROFILE SELECTOR WAS NOT FOUND')
      throw new Error('[LINKEDIN RESPONSE] PROFILE NOT FOUND')
    })

  logger.info('[PROFILE SCAN]', 'SCROLLING IN THE PAGE')
  await scrollToPageBottom(page)

  if(waitTimeToScrapMs) {
    logger.info('[PROFILE SCAN]', `APPLYING FIRST DELAY`)
    await new Promise((resolve) => { setTimeout(() => { resolve() }, waitTimeToScrapMs / 2)})
  }

  logger.info('[PROFILE SCAN]', 'CLICKING ON SEE MORE BUTTONS')
  await seeMoreButtons.clickAll(page)

  if(waitTimeToScrapMs) {
    logger.info('[PROFILE SCAN]', `APPLYING SECOND DELAY`)
    await new Promise((resolve) => { setTimeout(() => { resolve() }, waitTimeToScrapMs / 2)})
  }


  const [profileLegacy] = await scrapSection(page, template.profileLegacy)
  const [profileAlternative] = await scrapSection(page, template.profileAlternative)
  const [aboutLegacy] = await scrapSection(page, template.aboutLegacy)
  const [aboutAlternative] = await scrapSection(page, template.aboutAlternative)
  const positions = await scrapSection(page, template.positions)
  const educations = await scrapSection(page, template.educations)
  const [recommendationsCount] = await scrapSection(page, template.recommendationsCount)
  const recommendationsReceived = await scrapSection(page, template.recommendationsReceived)
  const recommendationsGiven = await scrapSection(page, template.recommendationsGiven)
  const skills = await scrapSection(page, template.skills)
  const accomplishments = await scrapSection(page, template.accomplishments)
  const volunteerExperience = await scrapSection(page, template.volunteerExperience)
  const peopleAlsoViewed = await scrapSection(page, template.peopleAlsoViewed)

  await page.close()
  logger.info('[PROFILE SCAN]', `FINISHED SCRAPING PROFILE USER: ${url}`)

  const rawProfile = {
    profileLegacy,
    profileAlternative,
    aboutLegacy,
    aboutAlternative,
    positions,
    educations,
    skills,
    recommendations: {
      givenCount: recommendationsCount ? recommendationsCount.given : "0",
      receivedCount: recommendationsCount ? recommendationsCount.received : "0",
      given: recommendationsReceived,
      received: recommendationsGiven
    },
    accomplishments,
    peopleAlsoViewed,
    volunteerExperience
  }

  const cleanedProfile = cleanProfileData(rawProfile)
  return cleanedProfile
}
