var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var userReg=require('./controllers/auth')
const supplier=require("./controllers/supplier")
const mongoose=require("mongoose")
const cookiesParser=require("cookie-parser")
const fs=require("fs")


mongoose.connect("mongodb://localhost:27017/blockchain",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
}).then(()=>{
    console.log("DB Connected")
})
app.use(bodyParser.json());
app.use(cookiesParser())

// Setting for Hyperledger Fabric
const { Wallets, Gateway } = require('fabric-network');
const path = require('path');
const jwt = require('jsonwebtoken');
const expressjwt=require("express-jwt");
const { constants } = require('buffer');
const {main}=require("./enrollAdmin")
const {connectToNetwork}=require("./network")
const FabricCAServices = require('fabric-ca-client');
const { json } = require('express');
const { productCheck } = require('./controllers/productChecker');
const supplierRoute=require("./routes/supplier")
const manifactureRoute=require("./routes/manifacturer")
// const ccpPath = path.resolve(__dirname, '.',  'connection-org1.json');
const ccpPath = path.resolve(__dirname, 
    '..', '..', 'test-network', 
    'organizations', 'peerOrganizations',
     'org1.example.com', 'connection-org1.json');
let ccp=JSON.parse(fs.readFileSync(ccpPath,"utf-8"))
app.get('/api/queryallcars', async function (req, res) {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');

        const wallet = await Wallets.newFileSystemWallet(walletPath);
    
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.get("Rohit Lokhande");
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'Rohit Lokhande', discovery: { enabled: true, asLocalhost: true } });
        console.log("HELLOOOO")
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
       
        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction('queryAllCars');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
});


app.get('/api/query/:car_index', async function (req, res) {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet (walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.get('Rohit Lokhande');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'Rohit Lokhande', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction('queryCar', req.params.car_index);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
});

app.post('/api/addcar/', async function (req, res) {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.get('appUser');
        if (!userExists){
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('createCar', req.body.carid, req.body.make, req.body.model, req.body.colour, req.body.owner);
        console.log('Transaction has been submitted');
        res.send('Transaction has been submitted');
        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
})

app.put('/api/changeowner/:car_index', async function (req, res) {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('changeCarOwner', req.params.car_index, req.body.owner);
        console.log('Transaction has been submitted');
        res.send('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }	
})

app.use("/api",supplierRoute)
app.use("/api",manifactureRoute)

app.post("/register",userReg.signUp)
app.post("/login",userReg.signin)

app.put("/checkedsupplierproduct",productCheck)

app.post("/connectToNetwork",async(req,res)=>{ 

//     console.log(req.body.username);
//     let networkObj= await connectToNetwork(req.body.username)
//     console.log("Helloooo");
//     let details= await networkObj.contract.evaluateTransaction("getdetails",req.body.username)
//   console.log(details.toString());
//   res.json(details.toString())
   
})



app.listen(8080);