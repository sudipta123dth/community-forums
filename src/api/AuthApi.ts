/* eslint-disable @typescript-eslint/no-explicit-any */

import ApiResponse from "@/interface/common/ApiResponse";

enum AuthMode {
  LOGIN = "auth/login",
  AUTHENTICATE_USER = "auth/authentication",
  CAPTCHA = "captcha/generate",
  LOGOUT = "auth/logout",
}

export default class AuthApi {
  baseUri = process.env.NEXT_PUBLIC_ENDPOINT_URL;

  async getCaptcha(): Promise<ApiResponse> {
    const uri = `${this.baseUri}/${AuthMode.CAPTCHA}`;
    const res = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.json();
  }

  async login(data: any): Promise<ApiResponse> {
    const uri = `${this.baseUri}/${AuthMode.LOGIN}`;
    const res = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async validateToken(token: string): Promise<ApiResponse> {
    const uri = `${this.baseUri}/${AuthMode.AUTHENTICATE_USER}`;
    const res = await fetch(uri, {
      method: "POST",
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  }

  async logoutUser(token: string): Promise<ApiResponse> {
    const uri = `${this.baseUri}/${AuthMode.LOGOUT}`;
    const res = await fetch(uri, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 401) {
      return {
        statusCode: 401,
        errorMessages: ["Unauthorized Access"],
        isSuccess: false,
        error: undefined,
        result: undefined,
      };
    }
    return res.json();
  }
}
