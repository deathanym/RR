const dependencies = {
  fs: require('fs'),
  config: require('../config.json')
}
//DATABASE CONNECT
const pool = require('./lib/database');


module.exports = (profileId, content, injection) => {
   
  const { fs, config } = Object.assign({}, dependencies, injection)

  if (!fs.existsSync(config.saveDirectory)) {
    fs.mkdirSync(config.saveDirectory)
  }
  //DATA EDUCATIONS
  const ArrayEduc = content.educations[0]; 
  const nameEduc = ArrayEduc.title;
  //validar title si en caso fuera null
  if(nameEduc != ''){
    nameEducacion = ArrayEduc.title;
  }else{
    nameEducacion = null;
  }

  //INSERT DATA
  const dataInser = {
    nombre: content.profileAlternative.name,
    pais: content.profileAlternative.location,
    n_contactos: content.profileAlternative.connections,
    descripcion_perfil: content.profileAlternative.summary, 
    formacion_academica: nameEducacion
  } 
  const InserData =  pool.query('INSERT INTO data_user set ?', [dataInser], function(err, result) {
    if (err) {
        // handle error
        console.log('NO SE PUDO INSERTAR');
      }else{
        //UPDATE DATA works
        const ArrayWork= content.positions[0]; 
        const nameWork = ArrayWork.title;
        const descripWork = ArrayWork.description
        const dateOnepWork = ArrayWork.date1
        const dateTwoWork = ArrayWork.date2
        const companyName = ArrayWork.companyName

        //validar title si en caso fuera null
        if(nameWork != '' || descripWork != '' || dateOnepWork != '' || dateTwoWork != ''){
          nameWorkss = nameWork;
          descripWorkss = descripWork;
          dateOneWk = dateOnepWork;
          dateTwoWk = dateTwoWork;
          compaName = companyName;
        }else{
          nameWorkss = null;
          descripWorkss = null;
          dateOneWk = null;
          dateTwoWk = null;
          compaName = null;
        }
        const dataInserWOEK = {
          company: compaName,
          name: nameWorkss,
          description: descripWorkss,
          historical_date: dateOneWk,
          summary_date: dateTwoWk,
          id_user: result.insertId
        };
        const InserDataWork =  pool.query('INSERT INTO works set ?', [dataInserWOEK]);
        console.log('.......Registro exitoso');
      }
  }); 

  return fs.writeFileSync(`${config.saveDirectory}/${profileId}.json`, JSON.stringify(content, undefined, 2))
}
