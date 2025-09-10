const verifyEmailTemplate = ({ name, url }) => {
  // this is the template for the email verification
  return `
<p>Dear <strong>${name}</strong>,</p>

<p>Thank you for registering with <strong>ZippyCart</strong>! 🎉<br/>
Please click the button below to verify your email address:</p>

<a href="${url}" 
   style="display:inline-block; padding:12px 20px; margin-top:20px; background-color:#ff7f00; color:#fff; text-decoration:none; font-weight:bold; border-radius:6px; font-family:Arial, sans-serif;">
   Verify Your Email
</a>

<p style="margin-top:20px; color:#555; font-size:14px;">
If you did not register on ZippyCart, please ignore this email.
</p>

<p>Best Regards,<br/>  
<strong>ZippyCart Team</strong></p>

  `;
};
export default verifyEmailTemplate;
