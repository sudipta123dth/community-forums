import ApiResponse from "@/interface/common/ApiResponse";
import {StatusCodes} from "http-status-codes";
import toastNotify from "./toastNotify";

const apiErrorToast = (json: ApiResponse) => {
  if (!!json.errorMessages?.length) {
    toastNotify(
      `${json?.statusCode}: ${json.errorMessages?.join("<br />")}`,
      "error"
    );
  } else {
    if (!isNaN(Number(json.statusCode))) {
      toastNotify(
        `${json?.statusCode}: ${
          StatusCodes[json?.statusCode ?? 500] || "Unknown Status Code"
        }`,
        "error"
      );
    } else {
      toastNotify(`${json?.statusCode}: ${json?.error}`, "error");
    }
  }
};

export {apiErrorToast};
