export const passwordResetTemplate = ({
  userName,
  resetUrl,
}) => {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:Arial;padding:30px;background:#f4f4f4">
<div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:8px">

<h2>Reset Password</h2>

<p>Hello ${userName},</p>

<p>A request was received to reset your password.</p>

<p>
<a
href="${resetUrl}"
style="
background:#0d6efd;
color:#fff;
padding:12px 24px;
text-decoration:none;
border-radius:6px;
display:inline-block;
"
>
Reset Password
</a>
</p>

<p>This link expires in 1 hour.</p>

</div>
</body>
</html>
`;
};