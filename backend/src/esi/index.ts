import * as got from "got";

interface CharacterObject {
  CharacterID: number;
  CharacterName: string;
  ExpiresOn: string;
  Scopes: string;
  TokenType: string;
  CharacterOwnerHash: string;
  IntellectualProperty: string;
}

/**
 * Base class for making ESI Requests
 */
export default class ESIRequest {
  token: string;
  character: CharacterObject;
  constructor(token: string) {
    this.token = token;
  }

  /**
   * Helper method for calling the EVE API
   * @param path
   * @param options
   */
  async call(path: string, options: object = {}) {
    const request = await got(`https://esi.tech.ccp.is/${path}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      json: true,
      ...options
    });
    return request.body;
  }

  /**
   * Get current logged in character
   */
  async getCharacter() {
    const { body: character } = await got(
      "https://login.eveonline.com/oauth/verify",
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        json: true
      }
    );
    console.log(character);
    const affiliations = await this.call(`latest/characters/affiliation`, {
      method: "POST",
      body: {
        characters: [character.characterID]
      }
    });
    this.character = { ...character, affiliations };
  }

  /**
   * Get solar system of current user
   */
  async getCurrentSolarSystem() {
    if (!this.character) {
      await this.getCharacter();
    }
    const { solar_system_id: solarSystemId } = await this.call(
      `v1/characters/${this.character.CharacterID}/location`
    );
    const solarSystem = await this.call(
      `latest/universe/systems/${solarSystemId}`
    );
    return solarSystem;
  }
}
