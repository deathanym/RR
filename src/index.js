////MAIN LIBRARY
const scrapedin = require('scrapedin')
const configFile = require('../config.json')
const crawl = require('./crawler')
const fs =  require('fs')
const xlsx = require('node-xlsx'); 
 
///A. STARTIG TO LOAD PROCESS
console.log('[INFO] Comenzando con el proceso de carga');
//LOAD PROFILE DATA 
const obj = xlsx.parse(fs.readFileSync(__dirname+`/profiles_get_data/profile_get.xlsx`));
const ProfileGet = obj[0];
const ProfiegetOne = ProfileGet.data; 
// const GetProfileF = ProfiegetOne[0];
// const profileone = ProfiegetOne[1]; 
 
//GUARDAR CICLO DE DATOS EN UN ARREGLO
Arraysm =  Array();
ProfiegetOne.forEach(function(element) {
  Arraysm.push('https://www.linkedin.com/in/'+element+'/'); 
});
//asignar variable de carga
const  rootProfiles =  Arraysm;
 
const config = {
  email: process.env.SCRAPEDIN_EMAIL || configFile.email,
  password: process.env.SCRAPEDIN_PASSWORD || configFile.password,
  hasToLog: configFile.hasToLog,
  isHeadless: configFile.isHeadless,
  puppeteerArgs: configFile.puppeteerArgs
}

scrapedin(config)
  .then((profileScraper) => crawl(profileScraper, rootProfiles))

//A. FINISH LOAD PROCESS  
 

