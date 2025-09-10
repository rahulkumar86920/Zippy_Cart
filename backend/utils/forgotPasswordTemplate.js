const forgotPasswordTemplate = ({ name, otp }) => {
  return `
<div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; color: #333; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: #fff;">
  
  <!-- Header -->
  <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
    <h2 style="margin: 0; color: #27ae60;">ZippyCart</h2>
  </div>

  <!-- Body -->
  <p>Dear <strong>${name}</strong>,</p>

  <p>We received a request to reset your password. Please use the OTP code below to proceed:</p>

  <div style="background: #f4f4f4; font-size: 22px; padding: 15px; text-align: center; font-weight: bold; border-radius: 6px; margin: 20px 0; letter-spacing: 3px; color: #222;">
    ${otp}
  </div>

  <p>This OTP is valid for <strong>1 hour</strong>. Enter it on the <strong>ZippyCart</strong> website to continue with resetting your password.</p>

  <p>If you did not request this password reset, please ignore this email or contact our support team immediately.</p>

  <!-- Footer -->
  <br />
  <p>Thanks & Regards,</p>
  <p><strong>ZippyCart Team</strong></p>

  <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 10px; font-size: 12px; text-align: center; color: #777;">
    © 2025 ZippyCart. All rights reserved.  
  </div>
</div>

    `;
};

export default forgotPasswordTemplate;
