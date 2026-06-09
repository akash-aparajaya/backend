import { chirpProvider } from "./chirp.provider.js";
import { plaidProvider } from "./plaid.provider.js";
import { mxProvider } from "./mx.provider.js";
import { yodleeProvider } from "./yodlee.provider.js";

export const providers = {
  chirp: chirpProvider,
  plaid: plaidProvider,
  mx: mxProvider,
  yodlee: yodleeProvider,
};
