import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Functions to update a Payment status based on Payment Id
   * @param id Payment Id to be updated.
   * @param status Payment status calculated by Anti Fraud system.
   * @returns Promise<string> that returns REST api call status.
   */
  async sendUpdate(id: string, status: string): Promise<string> {
    const uri = `http://localhost:3001/api/v1/payments/${id}`;
    try {
      console.log('To Update ', id, ' ', status);
      const response = await axios.patch(uri, { status });
      return response.data;
    } catch (error) {
      console.error(error.message);
    }
  }
}
