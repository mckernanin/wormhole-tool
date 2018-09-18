import { Request, Response, NextFunction } from "express";
import { sign, verify } from "jsonwebtoken";
import config from "../config";
import ESIRequest from "../esi";
import { HttpError } from "../utils/error";
import { authorizationUri, getToken } from "./oauth";
import userModel from "./model";

export const login = (req: Request, res: Response) =>
  res.redirect(authorizationUri);

export const callback = async (req: Request, res: Response) => {
  const { code } = req.query;
  const token = await getToken(code);
  const esi = new ESIRequest(token);
  await esi.getCharacter();
  console.log(esi);
  const jwt = sign({ token, character: esi.character }, config.jwtSecret, {
    expiresIn: config.jwtExpire
  });
  res.redirect(`/examples/hey-there?jwt=${jwt}`);
};

export const createToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const readToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.jwt) {
    throw new HttpError("No token provided.", 403);
  }
  const { jwt: token } = req.query.jwt;
  if (!token) {
    throw new HttpError("No token provided.", 403);
  }
  try {
    const decoded = verify(token, config.jwtSecret);
    req.user = decoded;
    return next();
  } catch (error) {
    throw new HttpError("Failed to authenticate token.", 403);
  }
};
