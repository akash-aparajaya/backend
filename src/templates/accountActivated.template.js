export const accountActivatedTemplate = ({ userName, loginUrl }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <title>Account Activated</title>
  </head>

  <body style="
      margin:0;
      padding:0;
      background:#f5f7fb;
      font-family:Arial,Helvetica,sans-serif;
  ">

      <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="padding:40px 0;"
      >
          <tr>
              <td align="center">

                  <table
                      width="600"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                          background:#ffffff;
                          border-radius:12px;
                          overflow:hidden;
                          box-shadow:0 4px 18px rgba(0,0,0,0.08);
                      "
                  >

                      <tr>
                          <td
                              style="
                                  background:#16a34a;
                                  color:white;
                                  text-align:center;
                                  padding:24px;
                                  font-size:24px;
                                  font-weight:bold;
                              "
                          >
                              Account Activated
                          </td>
                      </tr>

                      <tr>
                          <td style="padding:32px;">

                              <p>
                                  Hello ${userName},
                              </p>

                              <p>
                                  Your account setup has been completed successfully.
                              </p>

                              <p>
                                  Your login password and credential passkey have been securely configured.
                              </p>

                              <p>
                                  You can now access the Credential Management Platform using your registered email and password.
                              </p>

                              <div style="text-align:center;margin:35px 0;">

                                  <a
                                      href="${loginUrl}"
                                      style="
                                          background:#2563eb;
                                          color:white;
                                          text-decoration:none;
                                          padding:14px 28px;
                                          border-radius:8px;
                                          display:inline-block;
                                          font-weight:bold;
                                      "
                                  >
                                      Login Now
                                  </a>

                              </div>

                              <p>
                                  For security reasons, never share your password or credential passkey with anyone.
                              </p>

                              <p>
                                  Regards,<br/>
                                  Credential Management Team
                              </p>

                          </td>
                      </tr>

                  </table>

              </td>
          </tr>
      </table>

  </body>
  </html>
  `;
};
