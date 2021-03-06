import { callApi } from '../helpers/apiHelper';

export class FighterService {
  async getFighters() {
    try {
      const endpoint = 'fighters.json';
      const apiResult = await callApi(endpoint, 'GET');

      return apiResult;
    } catch (error) {
      throw error;
    }
  }

  async getFighterDetails(id) {
    try {
      const endpoint = `details/fighter/${id}.json`;
      const fighterDetails = await callApi(endpoint, 'GET');

      return fighterDetails;
    } catch (error) {
      throw error;
    }
    // todo: implement this method
    // endpoint - `details/fighter/${id}.json`;
  }
}

export const fighterService = new FighterService();
