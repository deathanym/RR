////MAIN LIBRARY
const scrapedin = require('scrapedin')
const configFile = require('../config.json')
const crawl = require('./crawler')
const fs =  require('fs')
const xlsx = require('node-xlsx'); 

//0. STARTING EXTRACT INFORMATION PRIVATE OF LINKEDIN
console.log('[INFO] Comenzando con el proceso de extracción de perfiles');
const dataExtract = xlsx.parse(fs.readFileSync(__dirname+`/profiles_get_data/data_email_main.xlsx`));
const dataExtractGet = dataExtract[0];
const DataExtrUser = dataExtractGet.data; 
//CICLE FOR FOR SAVE DATE LINKEDIN
ArrayData =  Array();
DataExtrUser.forEach(function(elements) {
  ArrayData.push('https://www.linkedin.com/in/'+elements+'/'); 
});
//ASSIGN VARIABLE ArrayData TO rootProfiles
const  rootProfiles =  ArrayData;
const config = {
  email: process.env.SCRAPEDIN_EMAIL || configFile.email,
  password: process.env.SCRAPEDIN_PASSWORD || configFile.password,
  hasToLog: configFile.hasToLog,
  isHeadless: configFile.isHeadless,
  puppeteerArgs: configFile.puppeteerArgs
}
//GET PROFILE USER
scrapedin(config)
  .then((profileScraper) => crawl(profileScraper, rootProfiles))