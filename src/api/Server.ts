import ApiResponse from "@/interface/common/ApiResponse";

/* eslint-disable @typescript-eslint/no-explicit-any */

type ServerParams =
  | {
      withAuth: true;
      spName: string;
      mode: number;
      token: string;
    }
  | {
      withAuth?: false;
      spName: string;
      mode: number;
    };

export default class ServerApi {
  private uri: string;
  private withAuth: boolean;
  private token?: string;
  private reqBody: any;
  // let reqBody: any

  constructor(params: ServerParams) {
    this.uri = !!params.withAuth
      ? `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/AuthDataGet/DExecuteJson/4/${params.spName}/${params.mode}`
      : `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/AnonymousDataGet/ExecuteJson/${params.spName}/${params.mode}`;

    this.withAuth = !!params.withAuth;
    this.token = params.withAuth ? params.token : undefined;
    // this.reqBody = {};
  }

  private async getOrigin(): Promise<string> {
    if (typeof window === "undefined") {
      // Server-side: lazy import to avoid client-side crash
      const { headers } = await import("next/headers");
      const h = await headers();
      const host = h.get("host");
      const protocol = h.get("x-forwarded-proto") || "http";
      return `${protocol}://${host}`;
    } else {
      // Client side
      return window.location.origin;
    }
  }

  async request(reqBody?: any): Promise<ApiResponse> {
    this.reqBody = reqBody ?? {};
    const origin = await this.getOrigin();

    const res = await fetch(this.uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
        ...(this.withAuth && {
          Authorization: `Bearer ${this.token}`,
        }),
      },
      body: JSON.stringify(this.reqBody),
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

  async refetch(): Promise<ApiResponse> {
    return await this.request(this.reqBody);
  }
}
