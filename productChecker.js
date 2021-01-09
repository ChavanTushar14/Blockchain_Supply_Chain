
const network=require("../network")
exports.productCheck=async(req,res)=>{
  const{prodcutName,checkerName,isVerified}=req.body 
  console.log(prodcutName);
  console.log(isVerified);
  const networkObj=network.connectToNetwork(checkerName)
  let isTransactionComplete=await networkObj.contract.submitTransaction("checkProduct",prodcutName,isVerified)
  if(isTransactionComplete){
    res.status(200).json({message:"TransactionComplete"})
}
else{
    res.status(200).json({message:"Transaction Failed"})
}

          networkObj.gateway.disconnect()
}