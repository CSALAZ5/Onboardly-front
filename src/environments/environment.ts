//export const host = 'http://localhost:8080';

//export const host = 'https://demo-bancodebogota.herokuapp.com/?api=';
//export const host = 'http://10.87.214.26:8004/picop';
export const host = 'https://localhost:8090';

export const environment = {
  production: false,
  api: { // Rest-full api data
    colaboradores: `${ host }/api/colaboradores`,
    calendario: `${ host }/api/calendario`,
    mail: `${ host }/api/mail`
  }

};
