$(document).ready(function(){
    $("button").click(function(){
      var username = $("#exampleInputEmail1").val();
      var password = $("#exampleInputPassword1").val();
      
      const Url = "http://localhost:8080/login";
      const data = {
        "email": username,
        "password" : password
       
      }
      const newdata= newLocal(Url,data);
      
    


      
      


     

    });
  });
  function newLocal(Url,data) { 
    fetch(Url, {
    method: "POST",
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json',
    },
    body: JSON.stringify(data)
  }).then(response => response.json())
  .then(data => {
    if(!data.error) {
    if (typeof(Storage) !== "undefined") {
      // Store
      localStorage.setItem("user", JSON.stringify(data));
      if(data.user.role == 'sup') {
      window.location.replace("http://127.0.0.1:5500/supplier.html");
      }
      else{
        window.location.replace("http://127.0.0.1:5500/manf.html");
      }
      
    } else {
      console.log("Error!");
    }
  }
  })
    .catch(err => console.log(err + "error"));
  }