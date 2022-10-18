window.onload = function (){
   if(sessionStorage.getItem("access_token")){
       window.location = "./public/dashboard.html";
       window.location.href(`${window.location}`);
   } else {
       window.location = "./public/login.html";
       window.location.href(`${window.location}`);
   }
   
}