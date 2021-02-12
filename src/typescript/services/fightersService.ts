import { callApi } from '../helpers/apiHelper';

class FighterService {
  async getFighters(): Promise<FighterInfo[]> {
    try {
      const endpoint: string = 'fighters.json';
      const apiResult: FighterInfo[] = await callApi(endpoint, 'GET');

      return apiResult;
    } catch (error) {
      throw error;
    }
  }

  async getFighterDetails(id:string): Promise<FighterInfo> {
    try {
      const endpoint = `details/fighter/${id}.json`;
      const apiResult: FighterInfo = await callApi(endpoint, 'GET');

      return apiResult;
    }
    catch (error) {
      throw error;
    }
  }
}

export const fighterService = new FighterService();
