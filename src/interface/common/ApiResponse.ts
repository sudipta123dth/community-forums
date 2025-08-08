/* eslint-disable @typescript-eslint/no-explicit-any */

export default interface ApiResponse {
  statusCode?: number;
  isSuccess?: boolean;
  errorMessages?: Array<string>;
  result: any | undefined;
  error?: any;
}
