import jwt from "jsonwebtoken";
// In your sendCookie function
export const sendCookie = (user, role, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id, role }, process.env.JWT_SECRET, {
    expiresIn: "60m",
  });

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: true, // must be true on HTTPS
      sameSite: "none" , // "none" needed for cross-site
      maxAge: 1 * 60 * 60 * 1000,
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

