////MAIN LIBRARY
const scrapedin = require('scrapedin')
const configFile = require('../config.json')
const crawl = require('./crawler')
const fs =  require('fs')
const xlsx = require('node-xlsx'); 
 
///A. STARTIG TO LOAD PROCESS
console.log('[INFO] BIENVENIDO AL SOFTWARE SCRAP-RIPLEY V1.9 BY DEATHANYM');
console.log('[INFO] COMENZADO LA MAGIA DE EXTRACCION DE INFORMACION');
//LOAD PROFILE DATA 
const obj = xlsx.parse(fs.readFileSync(__dirname+`/profiles_get_data/data_email_main2.xlsx`));
const ProfileGet = obj[0];
const ProfiegetOne = ProfileGet.data;  
//COUNT CICLE ITERATIVE
 
//GUARDAR CICLO DE DATOS EN UN ARREGLO
Arraysm =  Array();
ProfiegetOne.forEach(function(element) {
  Arraysm.push('https://www.linkedin.com/sales/gmail/profile/proxy/'+element+'/'); 
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
 

