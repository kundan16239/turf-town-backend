import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {Response, RestBindings} from '@loopback/rest';

@injectable({scope: BindingScope.TRANSIENT})
export class ApiResponseService {
  constructor(
    @inject(RestBindings.Http.RESPONSE) private response : Response
  ) {
  }

  /**
  * @desc    This file contain Success and Error response for sending to client / user
  */

  /**
  * @desc    Send any success response
  *
  * @param   {string} message
  * @param   {object | array} results
  * @param   {number} statusCode
  */
  async success(message: string, results: object | Array<any>, statusCode: number) {
    return {
      message,
      code: statusCode,
      data: results
    };
  }


  /**
  * @desc    Send any error response
  *
  * @param   {string} message
  * @param   {number} statusCode
  */
  async error(message: string, statusCode: number,results?: object | Array<any>,) {
    // List of common HTTP request code
    const codes = [200, 201, 400, 401, 404, 403, 422, 500];

    // Get matched code
    const findCode = codes.find((code) => code == statusCode);

    if (!findCode) statusCode = 500;
    else statusCode = findCode;
    this.response.statusCode = statusCode
    return {
      message,
      code: statusCode,
      data: results??{},
      error: true
    };
  };
}
