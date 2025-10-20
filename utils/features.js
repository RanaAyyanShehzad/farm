import jwt from "jsonwebtoken";
// In your sendCookie function
export const sendCookie = (user, role, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id, role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: true, // important since Vercel is HTTPS
      sameSite: "none", // allow cross-origin
      path: "/",// "none" needed for cross-site
      maxAge: 24* 60 * 60 * 1000,
    })           
    .json({
      success: true,
      message,
      token,
    });
};

export const successMessage=(res,message,statusCode=200)=>{
    res.status(statusCode).json({
        success:true,
        message,
    });
};

