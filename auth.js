const User=require("../models/user")
var jwt=require("jsonwebtoken")
var expressJwt=require("express-jwt")
const path=require("path")
const fs=require("fs")
const FabricCAServices=require("fabric-ca-client")
const {Wallets,Gateway}=require("fabric-network")
exports.signout=(req,res)=>{
    res.clearCookie('token')
    res.json({
        response:"user signout Successfully"
    })
}
exports.signUp=async(req,res)=>{
    var username=req.body.name;
    const ccpPath = path.resolve(__dirname, '..', '..',"..", 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const caUrl=ccp.certificateAuthorities["ca.org1.example.com"].url
        const ca=new FabricCAServices(caUrl);
        
        const walletPath=path.join(process.cwd(),"wallet");
        const wallet=await Wallets.newFileSystemWallet(walletPath)
        
        const userIdentity=await wallet.get(username);
        if(userIdentity){
            console.log("Its present");
            // console.log(userIdentity['credentials']['certificate']),
            // console.log(userIdentity['credentials']['privateKey'])
            console.log(await (await wallet.get(username).getProvider(username)))
            
            return 
        }
        const adminIdentity=await wallet.get("admin");
        if(!adminIdentity){
            try {
                // load the network configuration
                const ccpPath = path.resolve(__dirname, '..', '..',"..", 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
                const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        
                // Create a new CA client for interacting with the CA.
                const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
                const caTLSCACerts = caInfo.tlsCACerts.pem;
                const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
        
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = await Wallets.newFileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);
        
                // Check to see if we've already enrolled the admin user.
                const identity = await wallet.get('admin');
                if (identity) {
                    console.log('An identity for the admin user "admin" already exists in the wallet');
                    return;
                }
        
                // Enroll the admin user, and import the new identity into the wallet.
                const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
                const x509Identity = {
                    credentials: {
                        certificate: enrollment.certificate,
                        privateKey: enrollment.key.toBytes(),
                    },
                    mspId: 'Org1MSP',
                    type: 'X.509',
                };
                await wallet.put('admin', x509Identity);
                console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
        
            } catch (error) {
                console.error(`Failed to enroll admin user "admin": ${error}`);
                process.exit(1);
            }
        }
        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, '..', '..',"..", 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        
            // Create a new CA client for interacting with the CA.
            const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
            const ca = new FabricCAServices(caURL);
        
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
        
            // Check to see if we've already enrolled the user.
            const userIdentity = await wallet.get('appUser');
            if (userIdentity) {
                console.log('An identity for the user "appUser" already exists in the wallet');
                return;
            }
        
            // Check to see if we've already enrolled the admin user.
            const adminIdentity = await wallet.get('admin');
            if (!adminIdentity) {
                console.log('An identity for the admin user "admin" does not exist in the wallet');
                console.log('Run the enrollAdmin.js application before retrying');
                return;
            }
        
            // build a user object for authenticating with the CA
            const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, 'admin');
        
            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({
                affiliation: 'org1.department1',
                enrollmentID: username,
                role: 'client'
            }, adminUser);
            const enrollment = await ca.enroll({
                enrollmentID: username,
                enrollmentSecret: secret
            });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'Org1MSP',
                type: 'X.509',
            };
            await wallet.put(username, x509Identity);
            // let networkObj=await connectToNetwork(req.body.username)
        //    await networkObj.contract.submitTransaction("register",req.body.username,req.body.password)
        const user=new User(req.body)
        user.save((err,user)=>{
            if(err){
                console.log(err)
                return res.status(400).json({
                    "response":"Not able to save user in Db"
                })
            }
            res.json({
                name:user.name,
                email:user.email,
                orgName: user.orgName,
                id:user._id
            })
        })
            // console.log('Successfully registered and enrolled admin user "appUser" and imported it into the wallet');
    
            // res.json({success:true,message:username+"enrolled successfully"})
        } catch (error) {
            console.error(`Failed to register user "appUser": ${error}`);
            process.exit(1);
        }
    
}

exports.isAuthenticated=(req,res,next)=>{
    let checker=req.param.id ==req.auth._id
    if(!checker){
        return res.status(403).json({
            error:"ACCESS DENIED"
        })
    }
    next()
}

exports.signin=(req,res)=>{
    const {email,password}=req.body
    User.findOne({email},(err,user)=>{
        if(err ||!user){
            return res.status(400).json({
                error:"User email does't exist"
            })
        }
        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"Email and password doen't match"
            })
        }
        const token=jwt.sign({_id:user._id},"gasef")
        res.cookie("token",token,{expire:new Date()+9999})
        const {_id,name,email,role}=user
        return res.json({token,user:{_id,name,email,role}})
    })
}