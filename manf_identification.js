$(document).ready(function(){
    var id;
    var email;
    var token;
    var name;
    var role;
    var productID;

    if (typeof(Storage) !== "undefined") {
        user = JSON.parse(localStorage.getItem("user"))
        id = user.user._id;
        name = user.user.name;
        role = user.user.role;
        token = token;
        email = user.user.email;
        console.log(name)
        productID = localStorage.getItem("productID");
        $("#ManfName").text("Manufacturer Name : " + name);
        $("#ManfID").text("Manufacturer ID : " + id);
        } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
      }
    $("button").click(function(){
      var delivertdate = $("#DeliveryDate").val();
      var productquantity = $("#ProductQuantity").val();
      var DeliveryAdress = $("#DeliveryAdress").val();
      console.log(DeliveryAdress)
      const data = {
        "deliveryDate" : delivertdate.toString(),
        "productQuantity" : productquantity,
        "manifacName" : name,
        "manifacId" : id,
        "productId" : productID,
        "DeliveryAddress":DeliveryAdress,


      }
      console.log(typeof delivertdate)
      console.log(typeof delivertdate)
      console.log(typeof id)
      console.log(typeof productID)
      console.log(typeof name)
      console.log(typeof productquantity)
      
      const Url = "http://localhost:8080/api/callProduct/" + id;
      
      
      fetch(Url,{
        method:"POST",
        headers:{
          Accept:'application/json',
          "Content-Type": 'application/json',
          
        },
        body:JSON.stringify(data)
        
    }).then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      if(data.message == "TransactionComplete"){
        alert('TransactionComplete!')
      }
     
      
    })
    .catch(err=>console.log(err));
    
   
    //   window.location.replace("http://127.0.0.1:5500/login.html");
     

      

    });
    
  });