$(document).ready(function(){
    $("button").click(function(){
      var name = $("#exampleInputEmail1").val();
      var orgname = $("#exampleInputOrgName").val();
      var email = $("#exampleInputemail1").val();
      var password = $("#exampleInputPassword1").val();
      var role = $("#role").val();
      const Url = "http://localhost:8080/register";
      const data = {
        "name": name,
        "email": email,
        "password" : password,
        "role" : role,
        "orgName": orgname
      }
      
      fetch(Url,{
        method:"POST",
        headers:{
          Accept:'application/json',
          "Content-Type":'application/json',
            
        },
        body:JSON.stringify(data)
        
    }).then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      window.location.replace("http://127.0.0.1:5500/login.html");
    })
     .catch(err=>console.log(err))
   
     

      

    });
  });