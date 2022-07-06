const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {DateTime} = require('luxon')
const sendUserCreationEmail = require("../mail/sendAccountCreationMail");


const User = require("../models/Users")
const Buyer = require("../models/Buyer" )
const Vendor = require("../models/Vendor")
const UserOTPVerification = require("../models/UserOTPVerification");
const transporter = require("../mail/transporter");

JWT_SECRET = require("../utils/keys")

// GET request 
// Getting all the users
router.get("/", function(req, res) {
    User.find(function(err, users) {
		if (err) {
			console.log(err);
		} else {
			res.json(users);
		}
	})
});


// POST request 
// Add a user to db
router.post("/register", async (req, res) => {
    console.log("req.body--"+req.body)
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        contact: req.body.contact,
        type: req.body.type,
        verified: false
    });
    let typeUser;
    if (newUser.type === "buyer") {
        typeUser = new Buyer({
            email: req.body.email,
            age: req.body.age,
            batch: req.body.batch,
        });
    }
    else {
        typeUser = new Vendor({
            email: req.body.email,
            shop: req.body.shop,
            opening: req.body.opening,
            closing: req.body.closing
        });
        typeUser.opening = DateTime.fromISO(typeUser.opening).toLocaleString(DateTime.TIME_24_SIMPLE)
        typeUser.closing = DateTime.fromISO(typeUser.closing).toLocaleString(DateTime.TIME_24_SIMPLE)
    }


    bcrypt.hash(newUser.password,12)
        .then((retHash)=>{
            User.findOne({email:newUser.email})
                .then(async (savedUser)=>{
                    if(savedUser){
                        return res.json({
                            status: 1,
                            error:"User already exists with that email"
                        })
                    }
                    newUser.password = retHash;
                    newUser.save()
                        .then(async (user)=>{

                            //VERIFICATION BEGINS AFTER SAVING
                            const OTPResponse = await sendOTPVerificationEmail(user);
                            console.log(OTPResponse);

                            if(OTPResponse === 1)
                            {
                                return res.json({
                                    status: 1,
                                    message:"Error Occured While Sending OTP"
                                });
                            }

                            console.log("After sending OTP");
                            console.log(user.email)
                            console.log(user.password)
                            
                            // res.json({
                            //     status:"PENDING",
                            //     message: "Verification OTP Email Sent",
                            //     data:{
                            //         userId: _id,
                            //         email,
                            //     }//help us when we ask for a resend
                            // })

                            typeUser.save() //buyer or vendor
                                .then((user)=>{
                                    console.log(user.email)
                                    return res.json({
                                        status: 0,
                                        message:"Type Saved Successfully",
                                        userID: newUser.id
                                    })
                                })
                                .catch(async (err)=>{
                                    console.log(err)
                                    User.deleteOne({email: newUser.email})
                                    .then(() => {
                                        console.log("Deleted successfully")
                                    })
                                    .catch(() => {
                                        console.log("Error while deleting")
                                    })
                                    return res.json({
                                        status: 1,
                                        error: "Error registering user"
                                    })

                                })
                        })
                        .catch(async (err)=>{
                            console.log(err)
                            await newUser.remove()
                            return res.json({
                                status: 1,
                                error: "Error registering user"
                            })
                        })

                })
                .catch(async (err)=>{
                    console.log(err)
                    return res.json({
                        status: 1,
                        error: "Error registering user"
                    })
                })

        })
        .catch(async (err)=>{
            console.log(err)
            return res.json({
                status: 1,
                error: "Error creating hash"
            })
        })
});

// POST request 
// Login
router.post("/login", (req, res) => {
    let newUser = new User({
        email: req.body.email,
        password: req.body.password,
    });
    User.findOne({email: newUser.email})
        .then((retUser)=>{
            if(!retUser){
                return res.json({status: 1, error:"User with email does not exist!"})
            }
            if(retUser.verified === false){
                
                console.log("BACKEND : INSIDE AUTH");
                console.log(retUser);
                
                return res.json({status: 1, error:"Unverified User"})
            }
            bcrypt.compare(newUser.password, retUser.password)
                .then(match =>{
                    console.log(match);
                    if (match) {
                        const token = jwt.sign({
                            email: retUser.email,
                            type: retUser.type
                        }, JWT_SECRET);
                        return res.json({status: 0, token: token})
                    }
                    return res.json({status: 1, error:"Invalid password"})

                })
                .catch((err)=>{
                    console.log(err)
                    return res.json({status: 1, error: err})
                })
    })
});


router.post("/verifyOTP", async (req,res) =>{

    try{
        // let {userId, otp} = req.body.;

        let userId = req.body.ID;
        let otp = req.body.OTP.otp;

        console.log("Request: ");
        console.log(req);
        
        console.log("Request.BODY: ");
        console.log(req.body);

        console.log("inside verify OTP");
        console.log(userId);
        console.log(otp);

        if(!userId || !otp) //empty
        {
            throw Error("Empty OTP details are not allowed");
        }
        else
        {
            const UserOTPVerificationRecords = await UserOTPVerification.find({userId});

            if(UserOTPVerificationRecords.length <= 0){

                //no record found
                throw new Error("Account record doesnt exist or verified already");
            }
            else{

                const { expiresAt } = UserOTPVerificationRecords[0];
                const hashedOTP = UserOTPVerificationRecords[0].otp;

                if(expiresAt < Date.now()){

                    await UserOTPVerification.deleteMany({ userId });
                    throw new Error("Code has expired");
                }
                else{

                    const validOTP = await bcrypt.compare(otp, hashedOTP);

                    if(!validOTP){

                        //supplied otp is wrong

                        if(User.type === "buyer")
                            await Buyer.deleteMany({ userId });
                        else 
                            await Vendor.deleteMany({ userId });

                        throw new Error("Invalid Code Passed. Check your inbox");
                    }
                    else{

                        await User.updateOne({ _id: userId }, { verified: true} );

                        //do i need await here?
                        // await UserOTPVerification.deleteMany({ userId });

                        
                        // //HOW TO GET EMAIL ID AND NAME OF NEWLY CREATED USER OF USER ???

                        var newUserCreatedName, newUserCreatedEmail;
                        await User.findById(userId, function (err, docs) {
                            if (err){
                                console.log(err);
                            }
                            else{
                                console.log("Result : ", docs);

                                newUserCreatedName = docs.name;
                                newUserCreatedEmail = docs.email;

                                console.log("Set");
                                console.log(newUserCreatedName);
                                console.log(newUserCreatedEmail);
                                
                                //asuync not accepted here ??
                                sendUserCreationEmail(newUserCreatedName, newUserCreatedEmail);
                                console.log("confirmation mail sent");

                            }
                        });

                        // //send confimation mail
                        // console.log("Set");
                        // console.log(newUserCreatedName);
                        // console.log(newUserCreatedEmail);
                        // await sendUserCreationEmail(newUserCreatedName, newUserCreatedEmail);
                        //  console.log("confirmation mail sent");

                        res.json({
                            status: "VERIFIED",
                            message: `User email verified successfully`
                        });
                    }
                }
            }
        }

    }catch(error){

        res.json({
            status: "FAILED",
            message: error.message
        });
    }

});


//send OTP Verification Email
const sendOTPVerificationEmail = async (user) => {
    try {

        // {_id, email} = req.
        const _id = user._id;
        const email = user.email;

        //Create OTP beloning to 4 digit number till 9999
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        
        console.log("inside userOTPFxn");
        console.log("OTP: "+ otp);
        console.log("User id: "+_id);

        // const tempEmail = "harishumasankar18@gmail.com";
        const mailOptions = {
            from: '"Canteen Management" canteenportalmanagement@gmail.com',
            to: email,
            subject: "Please Confirm Your Email",
            html: `<p> Enter <b>${otp}</b> in the app to verify your email address and complete the signup process</p><p>This code <b>expires in 3 minutes</b>.</p>`,
        };
        
        const saltRounds = 10;

        const hashOTP = await bcrypt.hash(otp, saltRounds);
        const newOTPVerification = await new UserOTPVerification({
            userId: _id,
            otp: hashOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 180000, //1 hr in sec
        })

        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);

        console.log("mail Sent");
        return 0;
        // return res.json({
        //     status:"PENDING",
        //     message: "Verification OTP Email Sent",
        //     data:{
        //         userId: _id,
        //         email,
        //     }//help us when we ask for a resend
        // })

    }catch(error){
        return 1;
    }
}


module.exports = router;

