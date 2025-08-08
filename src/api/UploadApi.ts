import axios, { AxiosProgressEvent } from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/uploads`,
});

// Define a callback type for progress
type ProgressCallback = (progressEvent: AxiosProgressEvent) => void;

// Function to handle file upload with progress
const uploadFileWithProgress = (
  origin: string,
  formData: FormData,
  onProgress: ProgressCallback,
  token: string
) => {
  return axiosInstance.post("", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      Origin: origin,
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: onProgress,
  });
};

// Function to handle multiple file uploads with progress
const multiUploadFileWithProgress = (
  origin: string,
  formData: FormData,
  onProgress: ProgressCallback,
  token: string
) => {
  return axiosInstance.post("multiPost", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      Origin: origin,
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: onProgress,
  });
};

const getFileSizeFromUrl = async (url: string): Promise<number | null> => {
  try {
    const response = await axios.head(url);
    const contentLength = response.headers["content-length"];
    return contentLength ? parseInt(contentLength, 10) : null;
  } catch (error) {
    console.error("Error fetching file size:", error);
    return null;
  }
};

export default class UploadApi {
  baseUri = `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/uploads`;

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

  async uploadFile(args: {
    formData: FormData;
    onUploadProgress: ProgressCallback;
    token: string;
  }) {
    const { formData, onUploadProgress, token } = args;
    const origin = await this.getOrigin();
    try {
      const response = await uploadFileWithProgress(
        origin,
        formData,
        onUploadProgress,
        token
      );
      return response.data;
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      return {
        statusCode: error.response?.status,
        isSuccess: false,
        errorMessages: Array.isArray(error.response?.data?.errorMessages)
          ? error.response?.data?.errorMessages
          : [error.response?.data?.message || "Upload failed"],
        result: undefined,
        error: {
          status: error.response?.status,
          data: error.response?.data,
        },
      };
    }
  }

  async multiUploadFile(args: {
    formData: FormData;
    onUploadProgress: ProgressCallback;
    token: string;
  }) {
    const { formData, onUploadProgress } = args;
    const origin = await this.getOrigin();
    try {
      const response = await multiUploadFileWithProgress(
        origin,
        formData,
        onUploadProgress,
        args.token
      );
      return response.data;
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      return {
        statusCode: error.response?.status,
        errorMessages: Array.isArray(error.response?.data?.errorMessages)
          ? error.response?.data?.errorMessages
          : Array.isArray(error.response?.data)
          ? error.response?.data
          : [error.response?.data?.message || "Multi-upload failed"],
        isSuccess: false,
        error: undefined,
        result: undefined,
      };
    }
  }

  async deleteFile(docId: string, token: string) {
    const uri = `${this.baseUri}/${docId}`;
    const origin = await this.getOrigin();
    const res = await fetch(uri, {
      method: "DELETE",
      headers: {
        Origin: origin,
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  }

  async getFileSize(url: string) {
    try {
      const size = await getFileSizeFromUrl(url);
      return { data: size };
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      return {
        statusCode: error.response?.status,
        errorMessages: Array.isArray(error.response?.data)
          ? error.response?.data
          : [error.response?.data],
        isSuccess: false,
        error: undefined,
        result: undefined,
      };
    }
  }
}
