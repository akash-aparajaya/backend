// =============================================================================
// FILE: prisma/seed/service.provider.seed.js
// =============================================================================

const SERVICE_TYPES = [
  {
    name: "SMS",
    slug: "sms",
    description: "SMS messaging providers",
  },

  {
    name: "Email",
    slug: "email",
    description: "Email service providers",
  },

  {
    name: "WhatsApp",
    slug: "whatsapp",
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

    base_endpoint: "https://api.twilio.com",

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

    base_endpoint: "https://api.msg91.com",

    required_credential_schema: [
      {
        key: "api_key",
        label: "MSG91 API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter MSG91 API Key",
      },

      {
        key: "sender_id",
        label: "Sender ID",
        type: "text",
        required: true,
        placeholder: "MSGIND",
      },

      {
        key: "template_id",
        label: "DLT Template ID",
        type: "text",
        required: true,
        placeholder: "DLT Template ID",
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
      },

      {
        key: "api_secret",
        label: "Vonage API Secret",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter API Secret",
      },

      {
        key: "from_number",
        label: "From Number",
        type: "text",
        required: true,
        placeholder: "CompanyName",
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
      },

      {
        key: "port",
        label: "SMTP Port",
        type: "number",
        required: true,
        placeholder: "587",
      },

      {
        key: "username",
        label: "SMTP Username",
        type: "text",
        required: true,
        placeholder: "Enter Username",
      },

      {
        key: "password",
        label: "SMTP Password",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Password",
      },

      {
        key: "encryption",
        label: "Encryption",
        type: "select",
        required: false,
        default_value: "tls",

        options: [
          {
            label: "TLS",
            value: "tls",
          },

          {
            label: "SSL",
            value: "ssl",
          },

          {
            label: "None",
            value: "none",
          },
        ],
      },

      {
        key: "from_email",
        label: "From Email",
        type: "email",
        required: true,
        placeholder: "noreply@example.com",
      },

      {
        key: "from_name",
        label: "From Name",
        type: "text",
        required: false,
        placeholder: "Company Name",
      },
    ],
  },

  {
    service_slug: "email",

    name: "SendGrid",

    slug: "sendgrid",

    base_endpoint: "https://api.sendgrid.com",

    required_credential_schema: [
      {
        key: "api_key",
        label: "SendGrid API Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "SG.xxxxxxxxx",
      },

      {
        key: "from_email",
        label: "From Email",
        type: "email",
        required: true,
        placeholder: "noreply@example.com",
      },

      {
        key: "from_name",
        label: "From Name",
        type: "text",
        required: false,
        placeholder: "Company Name",
      },

      {
        key: "reply_to_email",
        label: "Reply To Email",
        type: "email",
        required: false,
        placeholder: "support@example.com",
      },
    ],
  },

  {
    service_slug: "email",

    name: "AWS SES",

    slug: "aws_ses",

    base_endpoint: "https://email.amazonaws.com",

    required_credential_schema: [
      {
        key: "mode",
        label: "Connection Mode",
        type: "select",
        required: true,
        default_value: "api",

        options: [
          {
            label: "API",
            value: "api",
          },

          {
            label: "SMTP",
            value: "smtp",
          },
        ],
      },

      {
        key: "access_key_id",
        label: "AWS Access Key ID",
        type: "text",
        required: true,
        placeholder: "AKIAxxxxxxxx",
      },

      {
        key: "secret_access_key",
        label: "AWS Secret Access Key",
        type: "password",
        required: true,
        is_secret: true,
        placeholder: "Enter Secret Key",
      },

      {
        key: "region",
        label: "AWS Region",
        type: "text",
        required: true,
        placeholder: "ap-south-1",
      },

      {
        key: "from_email",
        label: "From Email",
        type: "email",
        required: true,
        placeholder: "noreply@example.com",
      },
    ],
  },

  {
    service_slug: "email",

    name: "Mailgun",

    slug: "mailgun",

    base_endpoint: "https://api.mailgun.net",

    required_credential_schema: [
      {
        key: "api_key",
        label: "Mailgun API Key",
        type: "password",
        required: true,
        is_secret: true,
      },

      {
        key: "domain",
        label: "Mailgun Domain",
        type: "text",
        required: true,
        placeholder: "mg.example.com",
      },

      {
        key: "from_email",
        label: "From Email",
        type: "email",
        required: true,
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
      },

      {
        key: "from_email",
        label: "From Email",
        type: "email",
        required: true,
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

    base_endpoint: "https://graph.facebook.com",

    required_credential_schema: [
      {
        key: "phone_number_id",
        label: "Phone Number ID",
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

      {
        key: "business_account_id",
        label: "Business Account ID",
        type: "text",
        required: true,
      },

      {
        key: "webhook_verify_token",
        label: "Webhook Verify Token",
        type: "password",
        required: true,
        is_secret: true,
      },

      {
        key: "app_id",
        label: "Meta App ID",
        type: "text",
        required: false,
      },
    ],
  },

  {
    service_slug: "whatsapp",

    name: "Twilio WhatsApp",

    slug: "twilio_whatsapp",

    base_endpoint: "https://api.twilio.com",

    required_credential_schema: [
      {
        key: "account_sid",
        label: "Twilio Account SID",
        type: "text",
        required: true,
      },

      {
        key: "auth_token",
        label: "Twilio Auth Token",
        type: "password",
        required: true,
        is_secret: true,
      },

      {
        key: "phone_number",
        label: "WhatsApp Number",
        type: "text",
        required: true,
        placeholder: "whatsapp:+14155238886",
      },
    ],
  },

  {
    service_slug: "whatsapp",

    name: "Gupshup WhatsApp",

    slug: "gupshup_whatsapp",

    base_endpoint: "https://api.gupshup.io",

    required_credential_schema: [
      {
        key: "api_key",
        label: "Gupshup API Key",
        type: "password",
        required: true,
        is_secret: true,
      },

      {
        key: "app_name",
        label: "App Name",
        type: "text",
        required: true,
      },

      {
        key: "phone_number",
        label: "WhatsApp Number",
        type: "text",
        required: true,
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
    const createdServiceType =
      await prisma.serviceType.upsert({
        where: {
          slug: serviceType.slug,
        },

        update: {
          name: serviceType.name,
          description: serviceType.description,
          is_active: true,
        },

        create: {
          name: serviceType.name,
          slug: serviceType.slug,
          description: serviceType.description,
          is_active: true,
        },
      });

    serviceTypeMap[serviceType.slug] =
      createdServiceType;

    console.log(
      `✅ Service Type Seeded: ${serviceType.name}`
    );
  }

  // =============================================================================
  // CREATE PROVIDERS
  // =============================================================================

  for (const provider of PROVIDERS) {
    const serviceType =
      serviceTypeMap[provider.service_slug];

    if (!serviceType) {
      console.log(
        `❌ Service Type Not Found: ${provider.service_slug}`
      );

      continue;
    }

    await prisma.provider.upsert({
      where: {
        slug: provider.slug,
      },

      update: {
        service_type_id:
          serviceType.public_id,

        name: provider.name,

        base_endpoint:
          provider.base_endpoint,

        required_credential_schema:
          provider.required_credential_schema,

        is_active: true,
      },

      create: {
        service_type_id:
          serviceType.public_id,

        name: provider.name,

        slug: provider.slug,

        base_endpoint:
          provider.base_endpoint,

        required_credential_schema:
          provider.required_credential_schema,

        is_active: true,
      },
    });

    console.log(
      `✅ Provider Seeded: ${provider.name}`
    );
  }

  console.log(
    "🎉 Service Provider Seeder Completed"
  );
};

export default seedProvider;