import i18n from "@/i18n/i18n";
import { ApiResponse } from "@/types/api.type";

export const getGreetingText = (hour: number) => {
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 22) return "Good Evening";
  return "Good Night";
};


export interface HandledResponse<T> {
  ok: boolean;
  serverError: boolean;
  data?: T;
  message?: string;
  fieldErrors?: Record<string, string>;
  code: number;
}

/**
 * Generic response handler for ApiResponse<T>
 * Checks HTTP-style code and extracts field-level errors.
 */
export const handleResponse = <T>(response: ApiResponse<T>): HandledResponse<T> => {
  const { code, message, data } = response;


  const isSuccess = code >= 200 && code < 300;
  const isServerError = code >= 500 && code < 600;

  if (isSuccess) {
    return {
      ok: true,
      serverError: isServerError,
      code,
      data,
      message,
    };
  }

  let fieldErrors:  Record<string, string> | undefined = undefined;
  if (code === 400) {
    fieldErrors = (data as any);
  }


  return {
    ok: false,
    code,
    message: message || "An unexpected error occurred",
    fieldErrors,
    serverError: isServerError,
    data
  };
};

/**
 * Infer file name and MIME type from a given URI.
 * Works safely in React Native / Expo (no Blob or File API needed).
 */
export const inferFileMeta = (uri: string): { name: string; type: string } => {
  if (!uri) {
    return { name: "file", type: "application/octet-stream" };
  }

  const name = uri.split("/").pop() || "file";
  const extMatch = /\.(\w+)$/.exec(name);
  const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";

  const typeMap: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    heic: "image/heic",
    webp: "image/webp",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  const type = typeMap[ext] || "application/octet-stream";
  const finalName = name.includes(".") ? name : `${name}.${ext}`;

  return { name: finalName, type };
};

export const censorString = (
  input?: string | null,
  visibleFront = 2,
  visibleBack = 2,
  maskChar = "*"
): string => {
  if (!input || typeof input !== "string") return "";

  const length = input.length;
  if (length === 0) return "";
  if (length <= visibleFront + visibleBack) return input;

  const front = input.slice(0, Math.max(0, visibleFront));
  const back = input.slice(-Math.max(0, visibleBack));
  const maskLength = Math.max(0, length - (visibleFront + visibleBack));
  const masked = maskChar.repeat(maskLength);

  return `${front}${masked}${back}`;
};


export const handleError = (error: any): any => {
    if (error.response?.data) {
      if (error.response?.data.code >= 500 && error.response.data.code <= 599) {
        throw new Error(i18n.t("common.systemUnavailable"));
      }
      return error.response?.data;
    }
    if (error.message) {
      throw new Error(i18n.t("common.systemUnavailable"));
    }
    throw new Error(i18n.t("common.networkError"));
}


export const removeTime = (datetime: string): string => {
  if (!datetime) return "";


  const parts = datetime.split(" ");


  if (parts.length > 1 && parts[parts.length - 1].includes(":")) {
    parts.splice(parts.length - 1, 1);
  }

  return parts.join(" ");
};
