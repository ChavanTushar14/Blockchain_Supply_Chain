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
        $("#SupplierName").text("Supplier Name : " + name);
        $("#SupplierID").text("Supplier ID : " + id);
        const url = "http://localhost:8080/api/getallsupplierproduct/" + id.toString();
      
      
      fetch(url,{
        method:"GET",
        headers:{
          Accept:'application/json',
          "Content-Type":'application/json',

          
        },
        
        
    }).then(response => response.json())
    .then(data_1 => {
      data_1.forEach(element => {
        if(element.Record.docType == "manifacturer"){
          console.log('Success:', element);
          
          $("#imagerow").append(' </br> </br><div class="row name" > <ul><h3 id="ProductName">Manufacturer Name:'+ element.Record.manifacName+'  </h3><h3 id="ProdcutID">Product ID :'+ element.Record.product+' </h3><h3 id="SupplierName">Delivery Date : '+element.Record.deliveryDate+'</h3><h3 id="SupplierName">Quantity: '+element.Record.productQuantity+' </h3><h3> Delivery Address: '+element.Record.deliveryAddress+'</h3></div>  </ul></div>')
  
        }
        
      }).catch(err=>console.log(err))
      
      
    })

        
      } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
      }
    $("button").click(function(){
      var productname = $("#exampleName").val();
      var fileInput = document.getElementById('Image');
      var file = fileInput.files[0];
    
      var productimage = file;
      console.log(productimage);
      var isVerficationdone = false; 
      var today = new Date();
      var date = today.getDate()+'-'+(today.getMonth()+1)+ '-' + today.getFullYear();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let formData = new FormData()
      formData.append("id", id)
      formData.append("supplierName", name)
      formData.append("productName", productname)
      formData.append("productImage", productimage)
      formData.append("isVerificationDone", isVerficationdone)
      formData.append("date",date)
      formData.append("time",time)
      
      const Url = "http://localhost:8080/api/addproduct";
      
      
      fetch(Url,{
        method:"POST",
        headers:{
          Accept:'application/json',
          
        },
        body:(formData)
        
    }).then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      if(data.response.productId){
        alert('Product Added Sucessfully!')
      }
    })
     .catch(err=>console.log(err))
    //   window.location.replace("http://127.0.0.1:5500/login.html");
    
     

      

    });
  });