export const passkeyResetTemplate = ({
  userName,
  resetUrl,
}) => {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:Arial;padding:30px;background:#f4f4f4">
<div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:8px">

<h2>Reset Credential Passkey</h2>

<p>Hello ${userName},</p>

<p>
A request was made to reset your credential passkey.
</p>

<p>
Click below to continue.
</p>

<a
href="${resetUrl}"
style="
background:#0d6efd;
color:white;
padding:12px 24px;
text-decoration:none;
border-radius:6px;
display:inline-block;
"
>
Reset Passkey
</a>

<p style="margin-top:20px">
This link expires in 1 hour.
</p>

</div>
</body>
</html>
`;
};