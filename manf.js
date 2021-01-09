$(document).ready(function(){
    var id;
    var email;
    var token;
    var name;
    var role;

    

    if (typeof(Storage) !== "undefined") {

        user = JSON.parse(localStorage.getItem("user"))
        id = user.user._id;
        name = user.user.name;
        role = user.user.role;
        token = token;
        email = user.user.email;
        $("#ManfName").text("Manufacturer Name : " + name);
        $("#ManfID").text("Manufacturer ID : " + id);


        
      } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
      }
    
    //   window.location.replace("http://127.0.0.1:5500/login.html");
      const Url = "http://localhost:8080/api/getallsupplierproduct/" + id;
      
      
    fetch(Url,{
      method:"GET",
      headers:{
        Accept:'application/json',
        
      },
     
      
  }).then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    
    
    data.forEach(element => {
    
      var image = "data:image;base64," + element.Record.productImag
      var ProductID = element.Key;
      var SupplierName = element.Record.supplierName;
      var ProdcutName = element.Record.productName;
      var doctype = element.Record.docType;

       if(doctype == "supplyProduct"){

        $("#imagerow").append('<div class="row name" > <div class="col-md-8"> <img src='+ image + ' id = "image" width="600" height="500" alt="" srcset=""></div> <div class="col-md-4"> <div id= "content" ><h3 id="ProductName">Product Name:'+ ProdcutName+'  </h3> <h3 id="ProdcutID">Product ID :'+ ProductID+'  </h3><h3 id="SupplierName">Supplier Name:'+SupplierName+' </h3></div></div>  </div>')
        $(".name").click(function(){  
          if (typeof(Storage) !== "undefined") {
            // Store
            localStorage.setItem("productID", ProductID);
            
            window.location.replace("http://127.0.0.1:5500/manf_identification.html");
            
           
            
          }
          })
       }

       
     });
    
  })
   .catch(err=>console.log(err))
     

      


  });