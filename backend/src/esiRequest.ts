import * as got from "got";

export default class ESIRequest {
  token: string;
  character: any;
  constructor(token: string) {
    this.token = token;
  }

  async call(url: string, opts: object = {}) {
    const request = await got(`https://esi.tech.ccp.is/${url}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      json: true,
      ...opts
    });
    return request.body;
  }

  async getCharacter() {
    const request = await got("https://login.eveonline.com/oauth/verify", {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      json: true
    });
    console.log(request);
    this.character = request.body;
  }

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
