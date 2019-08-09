const logger = require('./logger')

const dependencies = {
  config: require('../config.json'),
  scrapProfile: require('./scrapProfile')
}

const WORKER_INTERVAL_MS = 1000

module.exports = async (profileScraper, rootProfiles, injection) => new Promise((resolve) => {
  const {
    config,
    scrapProfile
  } = Object.assign({}, dependencies, injection)

  let currentProfilesToCrawl = rootProfiles
  let currentProfilesToLengu = currentProfilesToCrawl.length;
  let nextProfilesToCrawl = []

   
  let parallelCrawlers = 0;
  const crawl = async (profileUrl) => { 
    ///SI NO AHI MAS PROFILES VALIDAR 
    if(profileUrl != undefined){
    parallelCrawlers++
    logger.info(`Starting scraping: ${profileUrl}`)
    console.log('0 '+profileUrl);

    const relatedProfiles = await scrapProfile(profileScraper, profileUrl)
     const largodelProfile = relatedProfiles.length;

    nextProfilesToCrawl = nextProfilesToCrawl.concat(relatedProfiles)
    nextProfilesToleng = nextProfilesToCrawl.length;

    logger.info(`Finish scraping: ${profileUrl} , ${largodelProfile} ...`)
    parallelCrawlers--
    }else{
      console.log('...............Loading');
    }
  } 

  setInterval(() => {
    if (currentProfilesToLengu === 0 && nextProfilesToleng === 0) {
      logger.info('Not found profile asociate....')
    } else if (currentProfilesToLengu === 0) {
      logger.info(`Finish process scan deep, starting a new scan for ${nextProfilesToleng}`)
      currentProfilesToCrawl = nextProfilesToCrawl
      nextProfilesToCrawl = []
    } else if (parallelCrawlers < config.maxConcurrentCrawlers) {
      const profileUrl = currentProfilesToCrawl.shift()
      crawl(profileUrl)
    }
  }, WORKER_INTERVAL_MS)
})
