import { create } from "simple-oauth2";
import { Request, Response } from "express";
import ESIRequest from "./esiRequest";

const {
  ESI_CLIENT: id = "",
  ESI_SECRET: secret = "",
  REDIRECT_URL = ""
} = process.env;

const oauth2 = create({
  client: {
    id,
    secret
  },
  auth: {
    tokenHost: "https://login.eveonline.com"
  }
});

const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: `${REDIRECT_URL}/oauth`,
  scope: "esi-location.read_location.v1"
});

export const login = (req: Request, res: Response) =>
  res.redirect(authorizationUri);

export const callback = async (req: Request, res: Response) => {
  const { code } = req.query;
  const tokenConfig = {
    code,
    scope: "esi-location.read_location.v1",
    redirect_uri: `${REDIRECT_URL}/oauth`
  };

  try {
    const result = await oauth2.authorizationCode.getToken(tokenConfig);
    const {
      token: { access_token: token }
    } = oauth2.accessToken.create(result);
    res.redirect(`/hey-there?token=${token}`);
  } catch (error) {
    console.error("Access token error", error);
    res.status(500).send(error.message);
  }
};

export const getCurrentSolarSystem = async (req: Request, res: Response) => {
  const { token } = req.query;
  const request = new ESIRequest(token);
  try {
    const solarSystem = await request.getCurrentSolarSystem();
    res.json(solarSystem);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const heyThere = async (req: Request, res: Response) => {
  const { token } = req.query;
  const request = new ESIRequest(token);
  try {
    const solarSystem = await request.getCurrentSolarSystem();
    res.send(
      `<h1>Hey there ${request.character.CharacterName}, how's ${
        solarSystem.name
      } looking right now?</h1>`
    );
  } catch (error) {
    res.status(500).json(error);
  }
};
