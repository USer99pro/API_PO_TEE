const User = require("../models/userModel");
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { userID: userId },process.env.JWT_SECRET,   // ✅ ดึงจาก .env
    { expiresIn: "3d" }
  );
};


exports.register = async(req,res,next) => {
    try {
        const { username ,email,password} = req.body;
        console.log(username,email,password);
        // const exitsEmail = await User.findOne({email:email});
        // if(exitsEmail){
        //    const err = new Error();
        //    throw err ;
        // }
        const user = new User({
           username:username ,
           email:email,
        })
        user.password = await user.encryptPassword(password)
        console.log(password);
        await user.save();

        const token = generateToken(user._id);

        res.json({
           message:"ลงทะเบียนเรียบร้อย" ,
           user: {
              id:user._id,
              username: user.username,
              email: user.email,
              role: user.role
           } ,
           token: token,
           expiresIn: '3d'
        })
    } catch (error) {
         res.json({
            message:" อีเมลนี้ถูกใช้แล้ว" 
         })
    }
}

exports.login = async(req,res,next)=> {
    try {
         const { email , password} = req.body
         console.log("พยายาม Login:" ,email );
         const user = await User.findOne({email: email }).select('+isDeleted');
         console.log(user.isDeleted);
         if(!user){
            return res.json({
               message: " email  ไม่ถูกต้อง"
            })
         }
         if (user.isDeleted){
            return res.json({
               message: " บัญชีนี้ถูกระงับการใช้งาน ..."
            })
         }

         const isValidPassword = await user.checkPassword(password);
         if( !isValidPassword ){
              return res.json({
                 message: "password ไม่ถูกต้อง"
              })
         }

         const token = generateToken(user._id);
         res.json({
            message: "เข้าสู่ระบบสำเร็จ",
            user:{
               id: user._id,
               username:user.username,
               email:user.email,
               image:user.image,
               role:user.role
            } ,
            token:token ,
            expiresIn: '3d'
         })

    } catch (error) {
       console.error("Login error:" , error.message);
       res.json({
         message: "เกิดข้อผิดพลาดในการเข้าสู้ระบบ"
       })
    }
}