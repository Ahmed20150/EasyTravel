const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
    return otp.toString();
  };
  
  module.exports = generateOtp;