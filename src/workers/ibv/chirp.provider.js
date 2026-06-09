import axios from "axios";
import convert from "xml-js";

const BASE_URL = "https://chirp.digital/api";

// =====================================================
// HELPERS
// =====================================================

const authHeaders = (api_key, extra = {}) => ({
  Authorization: api_key,
  ...extra,
});

const parseXML = (xml) => JSON.parse(convert.xml2json(xml, { compact: true }));

// =====================================================
// CHIRP PROVIDER
// =====================================================

export const chirpProvider = {
  // START IBV REQUEST
  start: async (data, credentials) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/createRequest`,
        {
          cusFirstName: data.first_name,
          cusLastName: data.last_name,
          cusEmail: data.email,
          cusPhone: data.phone,
          cusAccType: data.account_type ?? "Checking",
        },
        {
          headers: authHeaders(credentials.api_key, {
            Accept: "text/xml",
            "Content-Type": "application/json",
          }),
          responseType: "text",
        },
      );

      const json = parseXML(res.data);
      const requestId = json?.ReportDetails?.RequestCode?._text;

      if (!requestId) throw new Error("Missing RequestCode in Chirp response");

      return { requestId };
    } catch (err) {
      throw new Error(
        `Chirp createRequest failed: ${err.response?.status ?? err.message}`,
      );
    }
  },

  // GET STATUS
  status: async (requestId, credentials) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/getRequestStatus/${requestId}`,
        {},
        {
          headers: authHeaders(credentials.api_key, {
            "Content-Type": "application/json",
          }),
        },
      );
      const data = res.data;
      return data;
    } catch (err) {
      throw new Error(
        `Chirp getRequestStatus failed: ${
          err.response?.data?.message || err.response?.status || err.message
        }`,
      );
    }
  },

  // GET REPORT
  report: async (requestId, credentials) => {
    try {
      const res = await axios.get(`${BASE_URL}/request/${requestId}`, {
        headers: {
          Authorization: `${credentials.api_key}`,
          Accept: "application/json",
        },
        timeout: 15000,
        validateStatus: () => true, // IMPORTANT: don't throw automatically
      });

      // 🔥 Cloudflare block detection
      const isCloudflareBlock =
        typeof res.data === "string" &&
        res.data.includes("Cloudflare") &&
        res.status === 403;

      if (isCloudflareBlock) {
        throw new Error(
          "Blocked by Cloudflare. Backend IP must be whitelisted by Chirp.",
        );
      }

      if (res.status === 403) {
        throw new Error(
          "Forbidden (403): Invalid permissions or request not allowed.",
        );
      }

      if (res.status >= 400) {
        throw new Error(
          `Chirp API error: ${res.status} - ${JSON.stringify(res.data)}`,
        );
      }

      return {
        requestId,
        report: res.data?.ReportDetails ?? res.data,
      };
    } catch (err) {
      throw new Error(`Chirp getReport failed: ${err.message}`);
    }
  },

  // GENERATE CHIRP LINK
  link: async (requestId, credentials) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/genAuthTokenForChirpLink/chirpLink/${requestId}`,
        {},
        { headers: authHeaders(credentials.api_key) },
      );

      return res.data;
    } catch (err) {
      throw new Error(
        `Chirp generateLink failed: ${err.response?.status ?? err.message}`,
      );
    }
  },

  // CANCEL REQUEST
  cancel: async (requestId, credentials) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/cancelRequest/${requestId}`,
        {},
        { headers: authHeaders(credentials.api_key) },
      );

      return { cancelled: true, requestId, response: res.data };
    } catch (err) {
      throw new Error(
        `Chirp cancelRequest failed: ${err.response?.status ?? err.message}`,
      );
    }
  },
};
