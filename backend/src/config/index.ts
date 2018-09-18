import "dotenv/config";
import * as Joi from "joi";

const orEmptyString = value => value || "";

const environmentSchema = Joi.object({
  ESI_CLIENT: Joi.string().required(),
  ESI_SECRET: Joi.string().required(),
  REDIRECT_URL: Joi.string().required(),
  NODE_ENV: Joi.string()
    .allow(["development", "production", "test", "provision"])
    .default("development"),
  PORT: Joi.number().default(1337),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRE: Joi.number().required(),
  MONGODB: Joi.string().required()
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, environmentSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

interface EnvironmentVariables {
  esiId: string;
  esiSecret: string;
  redirectUrl: string;
  env: string;
  port: number;
  jwtSecret: string;
  jwtExpire: number;
  mongodb: string;
}

const variables: EnvironmentVariables = {
  esiId: orEmptyString(envVars.ESI_CLIENT),
  esiSecret: orEmptyString(envVars.ESI_SECRET),
  redirectUrl: orEmptyString(envVars.REDIRECT_URL),
  env: orEmptyString(envVars.NODE_ENV),
  port: Number(envVars.PORT) || 1337,
  jwtSecret: orEmptyString(envVars.JWT_SECRET),
  jwtExpire: Number(envVars.JWT_EXPIRE) || 86400,
  mongodb: orEmptyString(envVars.MONGODB)
};

export default variables;
