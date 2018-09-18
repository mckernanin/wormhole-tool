import { create } from "simple-oauth2";
import config from "../config";

/**
 * oauth2 object
 */
export const oauth2 = create({
  client: {
    id: config.esiId,
    secret: config.esiSecret
  },
  auth: {
    tokenHost: "https://login.eveonline.com/"
  }
});

/**
 * Endpoint for receiving token from EVE SSO
 */
export const redirectUri = `${config.redirectUrl}/v1/authentication/oauth`;

export const scope = "esi-location.read_location.v1";

/**
 * EVE SSO Login URL
 */
export const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: redirectUri,
  scope
});

/**
 * Get token from ESI
 * @param code auth code from SSO login
 */
export const getToken = async (code: string) => {
  const tokenConfig = {
    code,
    scope,
    redirect_uri: redirectUri
  };
  const result = await oauth2.authorizationCode.getToken(tokenConfig);
  const {
    token: { access_token: token }
  } = await oauth2.accessToken.create(result);
  return token;
};
