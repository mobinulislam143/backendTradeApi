const OtpModel = require('../models/OtpModel')
const UserModel = require('../models/UserModel')
const EmailSend = require('../utility/EmailHelper')
const { EncodeToken } = require('../utility/TokenHelper')
const cloudinary = require('cloudinary').v2

          
cloudinary.config({ 
  cloud_name: 'dmpsrcunj', 
  api_key: '368331831895173', 
  api_secret: '8P65ZkatdVy5oB4VdBa8APdY6h0' 
});

exports.UserRegistration = async(req, res) =>{
    try{
        const {email, name, mobile, department, password} = req.body

        let code=Math.floor(100000+Math.random()*900000);
        let EmailText=`Your Verification Code is= ${code}`
        let EmailSubject='Email Verification'

        if (mobile.length !== 11) {
            return res.status(400).json({ status: "failed", data: "Mobile number must be 11 digits long" });
        }
        
        let users = await UserModel.find({email:email}).count()

        if(users===0){
            await EmailSend(email,EmailText,EmailSubject);
            await OtpModel.updateOne({email:email}, {$set: {otp: code}}, {upsert: true})
            let result = await UserModel.create({
                name: name,
                email: email,
                mobile:mobile,
                department: department,
                password: password
            })
            res.status(200).json({status: "success",  data: result})
        }else{
            res.status(400).json({status: "failed",  data: "You are already register. please use another email address"}) 
        }
    }catch(e){
        res.status(400).json({status:"fail",data:e.toString()})
    }
}


exports.UserEmailVerify = async(req, res) =>{
    try {
        let email = req.params.email;
        let otp = req.params.otp;
        let status = 0;
        let total = await OtpModel.find({ email: email, otp: otp, status: status }).count();

        if (total === 1) {
            await OtpModel.updateOne({ email: email }, { $set: { otp: '0', status: '1' } });
            res.status(200).json({ status: "success", data: "Verification Completed" });
        } else {
            res.status(400).json({ status: "fail", data: "Invalid verification" });
        }
    } catch (e) {
        res.status(400).json({ status: "fail", data: e.toString() });
    }
};

exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ status: "failed", message: "Email doesn't match" });
        }

        // Check if the password matches
        if (user.password !== password) {
            return res.status(400).json({ status: 'failed', message: 'Password does not match' });
        }

        // Password matches
        let user_id = user._id.toString();
        let token = EncodeToken(email, user_id);
        let CookieOption = { expires: new Date(Date.now() + 24 * 60 * 60 * 1000), httpOnly: false };
        res.cookie('token', token, CookieOption);

        res.status(200).json({ status: "success", message: 'Login success', token: token, data: user });
    } catch (e) {
        res.status(400).json({ status: "fail", data: e.toString() });
    }
};

exports.changeImage = async (req, res) => {
    try {
        const userId = req.headers.user_id; 
        const result = await cloudinary.uploader.upload(req.file.path);

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }

        
        user.profileImg = result.secure_url;

        await user.save();

        if (user.profileImg !== result.secure_url) {
            const previousImageUrl = user.profileImg;
            const publicId = previousImageUrl.substring(previousImageUrl.lastIndexOf("/") + 1, previousImageUrl.lastIndexOf("."));
        
            await cloudinary.uploader.destroy(publicId);
        }
        res.status(200).json({ status: "success", data: user.profileImg });
    } catch (e) {
        // Handle errors
        res.status(400).json({ status: "fail", data: e.toString() });
    }
};

exports.logout = async(req, res)=>{
    let CookieOption = {expires: new Date(Date.now()-24*60*60*1000), httpOnly: false}
    res.cookie('token', "", CookieOption)
    res.status(200).json({ status: "success" });

}
exports.ReadProfile = async(req, res) =>{
    try{
        let user_id = req.headers.user_id
        let result = await UserModel.find({_id:user_id})
        res.status(200).json({ status: "success", data: result});


    }catch(e){
        return {status:"fail", message:"Something Went Wrong"}

    }
}