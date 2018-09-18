import { Request, Response } from "express";
import ESIRequest from "../esi";

export const getCurrentSolarSystem = async (req: Request, res: Response) => {
  const { token } = req.query;
  const request = new ESIRequest(token);
  const solarSystem = await request.getCurrentSolarSystem();
  res.json(solarSystem);
};

export const heyThere = async (req: Request, res: Response) => {
  const { token } = req.query;
  const request = new ESIRequest(token);
  const solarSystem = await request.getCurrentSolarSystem();
  res.send(
    `<h1>Hey there ${request.character.CharacterName}, how's ${
      solarSystem.name
    } looking right now?</h1>`
  );
};
