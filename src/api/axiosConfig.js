import axios from "axios";

const key = import.meta.env.VITE_USER_STORAGE_KEY;
const restapiurl = import.meta.env.VITE_REST_API_ROOT;



//localStorage.clear();

export const COMMON_API_HTTP = axios.create({
  baseURL: restapiurl,
});   


  let jwtToken;
 console.log(window.location.pathname);
 const pathname = window.location.pathname;
 const url = window.location.href;
  
console.log("axios starts");



//   if(pathname !== '/signin' && pathname !== '/'){

// if (localStorage.getItem('user')){

//   try{
   
//      const objectString1 = localStorage.getItem('user');
//      const user = JSON.parse(objectString1);
//    jwtToken = user.token;
//   }catch(e){}

// }else{
  
//   localStorage.clear();
// }
// }else{
//   localStorage.clear();

// }

COMMON_API_HTTP.defaults.headers.post['Content-Type'] = 'application/json';
// COMMON_API_HTTP.defaults.headers.common['Authorization']


//   if(pathname === '/signin' || pathname === '/'){

  
//   COMMON_API_HTTP.defaults.headers.common['Authorization']
// }
// else if (jwtToken) {
//   // console.log(jwtToken)
//   COMMON_API_HTTP.defaults.headers.common['Authorization'] = 'Token ' +jwtToken;
// }else {
//   COMMON_API_HTTP.defaults.headers.common['Authorization']
// }


COMMON_API_HTTP.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
COMMON_API_HTTP.defaults.headers.common['Access-Control-Allow-Methods']= 'GET,HEAD,OPTIONS,POST,PUT';
COMMON_API_HTTP.defaults.headers.common['Access-Control-Allow-Headers']= 'Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization';


export default COMMON_API_HTTP;

