import dotenv from "dotenv/config";
const { API_KEY, API_SECRET_KEY, SHOP, SCOPES, SHOPIFY_ACCESS_TOKEN } =
  process.env;
const envVars = {
  API_KEY,
  API_SECRET_KEY,
  SHOP,
  SCOPES,
  SHOPIFY_ACCESS_TOKEN,
};

export default envVars;
