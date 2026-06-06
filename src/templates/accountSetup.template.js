export const accountSetupTemplate = ({ userName, setupUrl }) => {
  return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8" />
<title>Setup Account</title>
</head>

<body
style="
font-family: Arial, sans-serif;
background:#f4f4f4;
padding:30px;
"
>

<div
style="
max-width:600px;
margin:auto;
background:#ffffff;
padding:30px;
border-radius:8px;
"
>

<h2>
Welcome to Credential Management Platform
</h2>

<p>
Hello ${userName},
</p>

<p>
Your account has been created.
</p>

<p>
Click the button below to setup your account.
</p>

<div style="margin:30px 0;">

<a
href="${setupUrl}"
style="
background:#0d6efd;
color:white;
padding:12px 24px;
text-decoration:none;
border-radius:6px;
display:inline-block;
"
>
Setup Account
</a>

</div>

<p>
This setup link will expire in 24 hours.
</p>

<p>
If you did not expect this email, please contact your administrator.
</p>

</div>

</body>
</html>
`;
};
