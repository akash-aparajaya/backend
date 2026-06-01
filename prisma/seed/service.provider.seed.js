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
  },

  {
    slug: "email",
    name: "Email",
    service_base_endpoint:
      "https://project-name/api/services/v1/dispatch/email",
    description: "Email service providers",
  },

  {
    slug: "whatsapp",
    name: "WhatsApp",
    service_base_endpoint:
      "https://project-name/api/services/v1/dispatch/whatsapp",
    description: "WhatsApp messaging providers",
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
    name: "MSG91",
    slug: "msg91",
    base_endpoint: "https://api.msg91.com/api/v5",
    required_credential_schema: [
      {
        key: "api_key",
        label: "MSG91 API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter MSG91 API Key",
        description: "MSG91 Auth Key from dashboard",
      },
      {
        key: "sender_id",
        label: "Sender ID",
        type: "text",
        required: true,
        placeholder: "Sender ID (6 characters)",
        description: "DLT-registered Sender ID (6 characters)",
      },
      {
        key: "template_id",
        label: "DLT Template ID",
        type: "text",
        required: true,
        placeholder: "DLT Template ID",
        description: "TRAI DLT-approved Template ID",
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
    name: "Telnyx SMS",
    slug: "telnyx_sms",
    base_endpoint: "https://api.telnyx.com/v2",
    required_credential_schema: [
      {
        key: "api_key",
        label: "API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "KEY01xxxxxxxx",
        description: "Telnyx API v2 Key from portal",
      },
      {
        key: "from_number",
        label: "From Number",
        type: "text",
        required: true,
        placeholder: "+14155238886",
        description: "Telnyx phone number in E.164 format",
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
    name: "Gupshup WhatsApp",
    slug: "gupshup_whatsapp",
    base_endpoint: "https://api.gupshup.io/sm/api/v1",
    required_credential_schema: [
      {
        key: "api_key",
        label: "Gupshup API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter API Key",
        description: "Gupshup API Key from developer portal",
      },
      {
        key: "app_name",
        label: "App Name",
        type: "text",
        required: true,
        placeholder: "MyAppName",
        description: "Gupshup registered app name",
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

  {
    service_slug: "whatsapp",
    name: "WATI",
    slug: "wati",
    base_endpoint: "https://live-server.wati.io/api/v1",
    required_credential_schema: [
      {
        key: "api_key",
        label: "API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter API Key",
        description: "WATI API Key from settings",
      },
    ],
  },

  {
    service_slug: "whatsapp",
    name: "Interakt",
    slug: "interakt",
    base_endpoint: "https://api.interakt.ai/v1",
    required_credential_schema: [
      {
        key: "api_key",
        label: "API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter API Key",
        description: "Interakt API Key from developer settings",
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
