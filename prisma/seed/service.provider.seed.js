// =============================================================================
// FILE: prisma/seed/service.provider.seed.js
// =============================================================================

const SERVICE_TYPES = [
  {
    slug: "sms",
    name: "SMS",
    service_base_endpoint:
      "https://project-name.com/api/services/v1/dispatch/sms",
    description: "SMS messaging providers",
    is_failover: true,
  },

  {
    slug: "email",
    name: "Email",
    service_base_endpoint:
      "https://project-name/api/services/v1/dispatch/email",
    description: "Email service providers",
    is_failover: true,
  },

  {
    slug: "whatsapp",
    name: "WhatsApp",
    service_base_endpoint:
      "https://project-name/api/services/v1/dispatch/whatsapp",
    description: "WhatsApp messaging providers",
    is_failover: true,
  },

  {
    slug: "ibv",
    name: "IBV",
    service_base_endpoint:
      "https://project-name.com/api/services/v1/dispatch/ibv",
    description: "Bank account verification and open banking providers",
    is_failover: false,
  },

  {
    slug: "credit_score",
    name: "Credit Score",
    service_base_endpoint:
      "https://project-name.com/api/services/v1/dispatch/credit-score",
    description: "Credit bureau and credit scoring providers",
    is_failover: false,
  },
  {
    slug: "payment-gateway",
    name: "Payment Gateway",
    service_base_endpoint:
      "https://project-name.com/api/services/v1/dispatch/payment-gateway",
    description: "Payment processing providers",
    is_failover: false,
  },
  {
    slug: "ach",
    name: "ACH",
    service_base_endpoint:
      "https://project-name.com/api/services/v1/dispatch/ach",
    description: "Automated Clearing House providers",
    is_failover: false,
  },
];

// =============================================================================
// PROVIDERS
// =============================================================================

const PROVIDERS = [
  // =============================================================================
  // SMS PROVIDERS
  // =============================================================================

  {
    service_slug: "sms",
    name: "Twilio SMS",
    slug: "twilio_sms",
    base_endpoint: "https://api.twilio.com/2010-04-01",
    required_credential_schema: [
      {
        key: "account_sid",
        label: "Twilio Account SID",
        type: "text",
        required: true,
        placeholder: "ACxxxxxxxxxxxxxxxx",
        description: "Twilio Account SID",
      },
      {
        key: "auth_token",
        label: "Twilio Auth Token",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Auth Token",
        description: "Twilio Auth Token",
      },
      {
        key: "phone_number",
        label: "Twilio Phone Number",
        type: "text",
        required: true,
        placeholder: "+14155238886",
        description: "Twilio registered phone number",
      },
    ],
  },

  {
    service_slug: "sms",
    name: "Vonage SMS",
    slug: "vonage_sms",
    base_endpoint: "https://rest.nexmo.com",
    required_credential_schema: [
      {
        key: "api_key",
        label: "Vonage API Key",
        type: "text",
        required: true,
        placeholder: "Enter API Key",
        description: "Vonage API Key from dashboard",
      },
      {
        key: "api_secret",
        label: "Vonage API Secret",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter API Secret",
        description: "Vonage API Secret from dashboard",
      },
      {
        key: "from_number",
        label: "From Number",
        type: "text",
        required: true,
        placeholder: "+14155238886",
        description: "Sender phone number or alphanumeric ID",
      },
    ],
  },

  {
    service_slug: "sms",
    name: "Infobip",
    slug: "infobip",
    base_endpoint: "https://api.infobip.com",
    required_credential_schema: [
      {
        key: "base_url",
        label: "Base URL",
        type: "text",
        required: true,
        placeholder: "https://xxxx.api.infobip.com",
        description: "Infobip API base URL provided by Infobip",
      },
      {
        key: "api_key",
        label: "API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Infobip API Key",
        description: "Infobip API authentication key",
      },
      {
        key: "sender_id",
        label: "Sender ID",
        type: "text",
        required: true,
        placeholder: "MyCompany",
        description: "SMS sender name",
      },
    ],
  },

  {
    service_slug: "sms",
    name: "Sinch SMS",
    slug: "sinch_sms",
    base_endpoint: "https://sms.api.sinch.com/xms/v1",
    required_credential_schema: [
      {
        key: "project_id",
        label: "Project ID",
        type: "text",
        required: true,
        placeholder: "Enter Project ID",
        description: "Sinch Project ID from Customer Dashboard",
      },
      {
        key: "access_key",
        label: "Access Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Access Key",
        description: "Sinch Access Key (used as API token)",
      },
      {
        key: "sender_id",
        label: "Sender ID",
        type: "text",
        required: true,
        placeholder: "+14155238886",
        description: "Sinch provisioned phone number or Sender ID",
      },
    ],
  },

  {
    service_slug: "sms",
    name: "Bird",
    slug: "bird",
    base_endpoint: "https://api.bird.com",
    required_credential_schema: [
      {
        key: "api_key",
        label: "API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Bird API Key",
        description: "Bird API authentication key",
      },
      {
        key: "sender_id",
        label: "Sender ID",
        type: "text",
        required: true,
        placeholder: "MyCompany",
        description: "SMS sender name or originator",
      },
    ],
  },

  {
    service_slug: "sms",
    name: "Plivo",
    slug: "plivo",
    base_endpoint: "https://api.plivo.com/v1",
    required_credential_schema: [
      {
        key: "auth_id",
        label: "Auth ID",
        type: "text",
        required: true,
        placeholder: "MAxxxxxxxxxxxxxxxx",
        description: "Plivo Auth ID from console",
      },
      {
        key: "auth_token",
        label: "Auth Token",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Auth Token",
        description: "Plivo Auth Token from console",
      },
      {
        key: "src",
        label: "Source Number",
        type: "text",
        required: true,
        placeholder: "+14155238886",
        description: "Plivo phone number to send from (E.164 format)",
      },
    ],
  },

  {
    service_slug: "sms",
    name: "TrueDialog SMS",
    slug: "truedialog_sms",
    base_endpoint: "https://api.truedialog.com/api/v2",
    required_credential_schema: [
      {
        key: "api_key",
        label: "TrueDialog API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter API Key",
        description: "TrueDialog API Key from dashboard",
      },
      {
        key: "sender_id",
        label: "Sender ID",
        type: "text",
        required: true,
        placeholder: "Registered Sender ID",
        description: "Registered Sender ID or short code",
      },
    ],
  },

  // =============================================================================
  // EMAIL PROVIDERS
  // =============================================================================

  {
    service_slug: "email",
    name: "SMTP",
    slug: "smtp",
    base_endpoint: "smtp://custom",
    required_credential_schema: [
      {
        key: "host",
        label: "SMTP Host",
        type: "text",
        required: true,
        placeholder: "smtp.gmail.com",
        description: "SMTP server hostname",
      },
      {
        key: "port",
        label: "SMTP Port",
        type: "number",
        required: true,
        placeholder: "587",
        description: "SMTP server port",
      },
      {
        key: "username",
        label: "SMTP Username",
        type: "text",
        required: true,
        placeholder: "user@example.com",
        description: "SMTP username",
      },
      {
        key: "password",
        label: "SMTP Password",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Password",
        description: "SMTP password or app password",
      },
      {
        key: "from_email",
        label: "From Email",
        type: "email",
        required: true,
        placeholder: "noreply@example.com",
        description: "Sender email address",
      },
    ],
  },

  {
    service_slug: "email",
    name: "SendGrid",
    slug: "sendgrid",
    base_endpoint: "https://api.sendgrid.com/v3",
    required_credential_schema: [
      {
        key: "api_key",
        label: "SendGrid API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "SG.xxxxxxxxx",
        description: "SendGrid API Key with Mail Send permission",
      },
      {
        key: "from_email",
        label: "From Email",
        type: "email",
        required: true,
        placeholder: "noreply@example.com",
        description: "Verified sender email address",
      },
    ],
  },

  {
    service_slug: "email",
    name: "AWS SES",
    slug: "aws_ses",
    base_endpoint: "https://email.{region}.amazonaws.com",
    required_credential_schema: [
      {
        key: "access_key_id",
        label: "AWS Access Key ID",
        type: "text",
        required: true,
        placeholder: "AKIAxxxxxxxx",
        description: "IAM user Access Key ID with SES permissions",
      },
      {
        key: "secret_access_key",
        label: "AWS Secret Access Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Secret Key",
        description: "IAM user Secret Access Key",
      },
      {
        key: "region",
        label: "AWS Region",
        type: "text",
        required: true,
        placeholder: "ap-south-1",
        description:
          "AWS region where SES is configured (e.g. us-east-1, ap-south-1)",
      },
      {
        key: "from_email",
        label: "From Email",
        type: "email",
        required: true,
        placeholder: "noreply@example.com",
        description: "SES-verified sender email address",
      },
    ],
  },

  {
    service_slug: "email",
    name: "Mailgun",
    slug: "mailgun",
    base_endpoint: "https://api.mailgun.net/v3",
    required_credential_schema: [
      {
        key: "api_key",
        label: "Mailgun API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "key-xxxxxxxxxxxxxxxx",
        description: "Mailgun Private API Key from dashboard",
      },
      {
        key: "domain",
        label: "Mailgun Domain",
        type: "text",
        required: true,
        placeholder: "mg.example.com",
        description: "Your verified Mailgun sending domain",
      },
      {
        key: "from_email",
        label: "From Email",
        type: "email",
        required: true,
        placeholder: "noreply@mg.example.com",
        description: "Sender address matching your Mailgun domain",
      },
    ],
  },

  {
    service_slug: "email",
    name: "Postmark",
    slug: "postmark",
    base_endpoint: "https://api.postmarkapp.com",
    required_credential_schema: [
      {
        key: "server_token",
        label: "Postmark Server Token",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        description: "Server API Token from Postmark dashboard",
      },
      {
        key: "from_email",
        label: "From Email",
        type: "email",
        required: true,
        placeholder: "noreply@example.com",
        description: "Postmark-verified sender signature email",
      },
    ],
  },

  {
    service_slug: "email",
    name: "Mailchimp Transactional (Mandrill)",
    slug: "mailchimp_transactional",
    base_endpoint: "https://mandrillapp.com/api/1.0",
    required_credential_schema: [
      {
        key: "api_key",
        label: "API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Mandrill API Key",
        description: "Mailchimp Transactional API Key",
      },
      {
        key: "from_email",
        label: "From Email",
        type: "email",
        required: true,
        placeholder: "noreply@example.com",
        description: "Verified sender email address",
      },
      {
        key: "from_name",
        label: "From Name",
        type: "text",
        required: false,
        placeholder: "My Application",
        description: "Sender display name",
      },
    ],
  },

  {
    service_slug: "email",
    name: "Brevo",
    slug: "brevo",
    base_endpoint: "https://api.brevo.com/v3",
    required_credential_schema: [
      {
        key: "api_key",
        label: "API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "xkeysib-xxxxxxxxxxxxxxxx",
        description: "Brevo API Key from account settings",
      },
      {
        key: "from_email",
        label: "From Email",
        type: "email",
        required: true,
        placeholder: "noreply@example.com",
        description: "Verified sender email address",
      },
    ],
  },

  {
    service_slug: "email",
    name: "Resend",
    slug: "resend",
    base_endpoint: "https://api.resend.com/v1",
    required_credential_schema: [
      {
        key: "api_key",
        label: "API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "re_xxxxxxxxxxxxxxxx",
        description: "Resend API Key from dashboard",
      },
      {
        key: "from_email",
        label: "From Email",
        type: "email",
        required: true,
        placeholder: "noreply@example.com",
        description: "Verified sender email address",
      },
    ],
  },

  // =============================================================================
  // WHATSAPP PROVIDERS
  // =============================================================================

  {
    service_slug: "whatsapp",
    name: "Meta Cloud API",
    slug: "meta_cloud",
    base_endpoint: "https://graph.facebook.com/v21.0",
    required_credential_schema: [
      {
        key: "phone_number_id",
        label: "Phone Number ID",
        type: "text",
        required: true,
        placeholder: "Enter Phone Number ID",
        description: "WhatsApp Business phone number ID from Meta dashboard",
      },
      {
        key: "access_token",
        label: "Access Token",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Access Token",
        description: "Permanent or temporary Meta access token",
      },
    ],
  },

  {
    service_slug: "whatsapp",
    name: "Twilio WhatsApp",
    slug: "twilio_whatsapp",
    base_endpoint: "https://api.twilio.com/2010-04-01",
    required_credential_schema: [
      {
        key: "account_sid",
        label: "Twilio Account SID",
        type: "text",
        required: true,
        placeholder: "ACxxxxxxxxxxxxxxxx",
        description: "Twilio Account SID from console",
      },
      {
        key: "auth_token",
        label: "Twilio Auth Token",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Auth Token",
        description: "Twilio Auth Token from console",
      },
      {
        key: "phone_number",
        label: "WhatsApp Number",
        type: "text",
        required: true,
        placeholder: "whatsapp:+14155238886",
        description: "Twilio WhatsApp number with whatsapp: prefix",
      },
    ],
  },

  {
    service_slug: "whatsapp",
    name: "Infobip WhatsApp",
    slug: "infobip_whatsapp",
    base_endpoint: "https://api.infobip.com",
    required_credential_schema: [
      {
        key: "base_url",
        label: "Base URL",
        type: "text",
        required: true,
        placeholder: "https://xxxx.api.infobip.com",
        description: "Infobip API base URL",
      },
      {
        key: "api_key",
        label: "API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter API Key",
        description: "Infobip API Key",
      },
    ],
  },

  {
    service_slug: "whatsapp",
    name: "Vonage WhatsApp",
    slug: "vonage_whatsapp",
    base_endpoint: "https://messages-sandbox.nexmo.com",
    required_credential_schema: [
      {
        key: "api_key",
        label: "API Key",
        type: "text",
        required: true,
        placeholder: "Enter API Key",
        description: "Vonage API Key",
      },
      {
        key: "api_secret",
        label: "API Secret",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter API Secret",
        description: "Vonage API Secret",
      },
    ],
  },

  {
    service_slug: "whatsapp",
    name: "Sinch WhatsApp",
    slug: "sinch_whatsapp",
    base_endpoint: "https://us.conversation.api.sinch.com",
    required_credential_schema: [
      {
        key: "project_id",
        label: "Project ID",
        type: "text",
        required: true,
        placeholder: "Enter Project ID",
        description: "Sinch Conversation API Project ID",
      },
      {
        key: "access_key",
        label: "Access Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Access Key",
        description: "Sinch Access Key",
      },
    ],
  },

  {
    service_slug: "whatsapp",
    name: "360Dialog",
    slug: "360dialog",
    base_endpoint: "https://waba-v2.360dialog.io/v1",
    required_credential_schema: [
      {
        key: "api_key",
        label: "API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter API Key",
        description: "360Dialog API Key from partner hub",
      },
    ],
  },

  // =============================================================================
  // IBV PROVIDERS
  // =============================================================================

  {
    service_slug: "ibv",
    name: "Plaid",
    slug: "plaid",
    base_endpoint: "https://production.plaid.com",
    required_credential_schema: [
      {
        key: "client_id",
        label: "Client ID",
        type: "text",
        required: true,
        placeholder: "Enter Client ID",
        description: "Plaid Client ID",
      },
      {
        key: "secret",
        label: "Secret",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Secret",
        description: "Plaid Secret Key",
      },
    ],
  },

  {
    service_slug: "ibv",
    name: "MX",
    slug: "mx",
    base_endpoint: "https://int-api.mx.com",
    required_credential_schema: [
      {
        key: "client_id",
        label: "Client ID",
        type: "text",
        required: true,
        placeholder: "Enter Client ID",
        description: "MX Client ID",
      },
      {
        key: "api_key",
        label: "API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter API Key",
        description: "MX API Key",
      },
    ],
  },

  {
    service_slug: "ibv",
    name: "Yodlee",
    slug: "yodlee",
    base_endpoint: "https://api.yodlee.com",
    required_credential_schema: [
      {
        key: "client_id",
        label: "Client ID",
        type: "text",
        required: true,
        placeholder: "Enter Client ID",
        description: "Yodlee Client ID",
      },
      {
        key: "client_secret",
        label: "Client Secret",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Client Secret",
        description: "Yodlee Client Secret",
      },
      {
        key: "admin_login_name",
        label: "Admin Login Name",
        type: "text",
        required: true,
        placeholder: "admin_user",
        description: "Yodlee Admin Login Name",
      },
    ],
  },

  {
    service_slug: "ibv",
    name: "Chirp",
    slug: "chirp",
    base_endpoint: "https://chirp.digital",
    required_credential_schema: [
      {
        key: "api_key",
        label: "API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter API Key",
        description: "Chirp API Key from Chirp Portal",
      },
    ],
  },

  // =============================================================================
  // credit score providers
  // =============================================================================

  {
    service_slug: "credit_score",
    name: "Decentro",
    slug: "decentro",
    display_order: 1,
    base_endpoint: "https://in.decentro.tech",
    required_credential_schema: [
      {
        key: "client_id",
        label: "Client ID",
        type: "text",
        required: true,
        placeholder: "Enter Client ID",
        description: "Decentro Client ID",
      },
      {
        key: "client_secret",
        label: "Client Secret",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Client Secret",
        description: "Decentro Client Secret",
      },
    ],
  },

  {
    service_slug: "credit_score",
    name: "TransUnion",
    slug: "transunion",
    display_order: 2,
    base_endpoint: "https://api.transunion.com",
    required_credential_schema: [
      {
        key: "client_id",
        label: "Client ID",
        type: "text",
        required: true,
        placeholder: "Enter Client ID",
        description: "TransUnion Client ID",
      },
      {
        key: "client_secret",
        label: "Client Secret",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Client Secret",
        description: "TransUnion Client Secret",
      },
    ],
  },

  {
    service_slug: "credit_score",
    name: "Experian",
    slug: "experian",
    display_order: 3,
    base_endpoint: "https://api.experian.com",
    required_credential_schema: [
      {
        key: "client_id",
        label: "Client ID",
        type: "text",
        required: true,
        placeholder: "Enter Client ID",
        description: "Experian Client ID",
      },
      {
        key: "client_secret",
        label: "Client Secret",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Client Secret",
        description: "Experian Client Secret",
      },
    ],
  },

  {
    service_slug: "credit_score",
    name: "Equifax",
    slug: "equifax",
    display_order: 4,
    base_endpoint: "https://api.equifax.com",
    required_credential_schema: [
      {
        key: "client_id",
        label: "Client ID",
        type: "text",
        required: true,
        placeholder: "Enter Client ID",
        description: "Equifax Client ID",
      },
      {
        key: "client_secret",
        label: "Client Secret",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Client Secret",
        description: "Equifax Client Secret",
      },
    ],
  },

  // =============================================================================
  // payment gateway providers
  // =============================================================================

  {
    service_slug: "payment-gateway",
    name: "Razorpay",
    slug: "razorpay",
    display_order: 1,
    base_endpoint: "https://api.razorpay.com",
    required_credential_schema: [
      {
        key: "key_id",
        label: "Key ID",
        type: "text",
        required: true,
        placeholder: "Enter Key ID",
        description: "Razorpay Key ID",
      },
      {
        key: "key_secret",
        label: "Key Secret",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Key Secret",
        description: "Razorpay Key Secret",
      },
    ],
  },
  {
    service_slug: "payment-gateway",
    name: "PayU",
    slug: "payu",
    display_order: 2,
    base_endpoint: "https://secure.payu.in",
    required_credential_schema: [
      {
        key: "merchant_key",
        label: "Merchant Key",
        type: "text",
        required: true,
        placeholder: "Enter Merchant Key",
        description: "PayU Merchant Key",
      },
      {
        key: "merchant_salt",
        label: "Merchant Salt",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Merchant Salt",
        description: "PayU Merchant Salt",
      },
    ],
  },
  {
    service_slug: "payment-gateway",
    name: "PhonePe",
    slug: "phonepe",
    display_order: 3,
    base_endpoint: "https://api.phonepe.com",
    required_credential_schema: [
      {
        key: "merchant_id",
        label: "Merchant ID",
        type: "text",
        required: true,
        placeholder: "Enter Merchant ID",
        description: "PhonePe Merchant ID",
      },
      {
        key: "client_id",
        label: "Client ID",
        type: "text",
        required: true,
        placeholder: "Enter Client ID",
        description: "PhonePe Client ID",
      },
      {
        key: "client_secret",
        label: "Client Secret",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Client Secret",
        description: "PhonePe Client Secret",
      },
    ],
  },
  {
    service_slug: "payment-gateway",
    name: "IppoPay",
    slug: "ippopay",
    display_order: 4,
    base_endpoint: "https://api.ippopay.com",
    required_credential_schema: [
      {
        key: "api_key",
        label: "API Key",
        type: "text",
        required: true,
        placeholder: "Enter API Key",
        description: "IppoPay API Key",
      },
      {
        key: "api_secret",
        label: "API Secret",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter API Secret",
        description: "IppoPay API Secret",
      },
    ],
  },
  {
    service_slug: "payment-gateway",
    name: "Stripe",
    slug: "stripe",
    display_order: 5,
    base_endpoint: "https://api.stripe.com",
    required_credential_schema: [
      {
        key: "publishable_key",
        label: "Publishable Key",
        type: "text",
        required: true,
        placeholder: "Enter Publishable Key",
        description: "Stripe Publishable Key",
      },
      {
        key: "secret_key",
        label: "Secret Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Secret Key",
        description: "Stripe Secret Key",
      },
    ],
  },
  {
    service_slug: "payment-gateway",
    name: "PayPal",
    slug: "paypal",
    display_order: 6,
    base_endpoint: "https://api.paypal.com",
    required_credential_schema: [
      {
        key: "client_id",
        label: "Client ID",
        type: "text",
        required: true,
        placeholder: "Enter Client ID",
        description: "PayPal Client ID",
      },
      {
        key: "client_secret",
        label: "Client Secret",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Client Secret",
        description: "PayPal Client Secret",
      },
    ],
  },

  // =============================================================================
  // ACH providers
  // =============================================================================

  {
    service_slug: "ach",
    name: "Stripe ACH",
    slug: "stripe_ach",
    display_order: 1,
    base_endpoint: "https://api.stripe.com",
    required_credential_schema: [
      {
        key: "publishable_key",
        label: "Publishable Key",
        type: "text",
        required: true,
      },
      {
        key: "secret_key",
        label: "Secret Key",
        type: "password",
        required: true,
        is_secret: true,
      },
    ],
  },
  {
    service_slug: "ach",
    name: "Loan Payment Pro",
    slug: "loan_payment_pro",
    display_order: 2,
    base_endpoint: "https://api.loanpaymentpro.com",
    required_credential_schema: [
      {
        key: "client_id",
        label: "Client ID",
        type: "text",
        required: true,
      },
      {
        key: "client_secret",
        label: "Client Secret",
        type: "password",
        required: true,
        is_secret: true,
      },
    ],
  },
  {
    service_slug: "ach",
    name: "Square",
    slug: "square",
    display_order: 3,
    base_endpoint: "https://connect.squareup.com",
    required_credential_schema: [
      {
        key: "application_id",
        label: "Application ID",
        type: "text",
        required: true,
      },
      {
        key: "access_token",
        label: "Access Token",
        type: "password",
        required: true,
        is_secret: true,
      },
    ],
  },
  {
    service_slug: "ach",
    name: "Dwolla",
    slug: "dwolla",
    display_order: 4,
    base_endpoint: "https://api.dwolla.com",
    required_credential_schema: [
      {
        key: "client_id",
        label: "Client ID",
        type: "text",
        required: true,
      },
      {
        key: "client_secret",
        label: "Client Secret",
        type: "password",
        required: true,
        is_secret: true,
      },
    ],
  },
];
// =============================================================================
// SEED FUNCTION
// =============================================================================

const seedProvider = async (prisma) => {
  console.log("🌱 Service Provider Seeder Started...");

  const serviceTypeMap = {};

  // =============================================================================
  // CREATE SERVICE TYPES
  // =============================================================================

  for (const serviceType of SERVICE_TYPES) {
    const createdServiceType = await prisma.serviceType.upsert({
      where: {
        slug: serviceType.slug,
      },

      update: {
        name: serviceType.name,
        description: serviceType.description,
        service_base_endpoint: serviceType.service_base_endpoint,
        is_active: true,
      },

      create: {
        name: serviceType.name,
        slug: serviceType.slug,
        description: serviceType.description,
        service_base_endpoint: serviceType.service_base_endpoint,
        is_active: true,
      },
    });

    serviceTypeMap[serviceType.slug] = createdServiceType;

    console.log(`✅ Service Type Seeded: ${serviceType.name}`);
  }

  // =============================================================================
  // CREATE PROVIDERS
  // =============================================================================

  for (const provider of PROVIDERS) {
    const serviceType = serviceTypeMap[provider.service_slug];

    if (!serviceType) {
      console.log(`❌ Service Type Not Found: ${provider.service_slug}`);

      continue;
    }

    await prisma.provider.upsert({
      where: {
        slug: provider.slug,
      },

      update: {
        service_type_id: serviceType.public_id,

        name: provider.name,

        base_endpoint: provider.base_endpoint,

        required_credential_schema: provider.required_credential_schema,

        is_active: true,
      },

      create: {
        service_type_id: serviceType.public_id,

        name: provider.name,

        slug: provider.slug,

        base_endpoint: provider.base_endpoint,

        required_credential_schema: provider.required_credential_schema,

        is_active: true,
      },
    });

    console.log(`✅ Provider Seeded: ${provider.name}`);
  }

  console.log("🎉 Service Provider Seeder Completed");
};

export default seedProvider;
