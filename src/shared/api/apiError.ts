import axios from "axios";

import type {
  ApiErrorDetails,
  ApiErrorMessageOverrides,
  ApiErrorResponse,
} from "../types";

// Checks whether the error is an Axios error
// and whether it matches a specific HTTP status.
export function hasApiStatus(error: unknown, status: number): boolean {
  return axios.isAxiosError(error) && error.response?.status === status;
}

// Normalizes any error into a consistent frontend shape:
// { message, status, errorCode }
export function getApiErrorDetails(
  error: unknown,
  overrides: ApiErrorMessageOverrides = {},
): ApiErrorDetails {
  const {
    timeout = "La solicitud tardó demasiado. Intente nuevamente.",
    noResponse = "No se recibió respuesta del servidor. Verifique su conexión.",
    conflict = "Ya existe un conflicto con el recurso solicitado.",
    fallback = "Ocurrió un problema al procesar la solicitud. Intente nuevamente.",
    byErrorCode = {},
    byStatus = {},
  } = overrides;

  // If this is not an Axios error, try to use its message.
  // Otherwise fall back to the default frontend message.
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return {
      message:
        error instanceof Error && error.message.trim().length > 0
          ? error.message
          : fallback,
    };
  }

  // Handle request timeout errors explicitly.
  if (error.code === "ECONNABORTED") {
    return { message: timeout };
  }

  // The request was sent, but no response was received.
  if (!error.response && error.request) {
    return { message: noResponse };
  }

  // Read the new backend shape: { status, errorCode, message }.
  const apiError = error.response?.data;
  const status = apiError?.status ?? error.response?.status;
  const errorCode = apiError?.errorCode;

  // If the frontend provides a custom message for a specific errorCode,
  // use that before any backend message.
  if (typeof errorCode === "string" && typeof byErrorCode[errorCode] === "string") {
    return {
      status,
      errorCode,
      message: byErrorCode[errorCode] as string,
    };
  }

  // If the frontend provides a custom message for a specific HTTP status,
  // use that before the backend message.
  if (typeof status === "number" && typeof byStatus[status] === "string") {
    return {
      status,
      errorCode,
      message: byStatus[status] as string,
    };
  }

  // The backend now sends a client-safe message,
  // so this becomes the primary message source.
  if (typeof apiError?.message === "string" && apiError.message.trim().length > 0) {
    return {
      status,
      errorCode,
      message: apiError.message,
    };
  }

  // Keep a generic 409 fallback only if the backend
  // did not provide a useful message.
  if (status === 409) {
    return {
      status,
      errorCode,
      message: conflict,
    };
  }

  // Final fallback if nothing else is usable.
  return {
    status,
    errorCode,
    message: fallback,
  };
}

// Keeps compatibility with the current frontend usage.
// If you only need the string message, you can keep using this helper.
export function getApiErrorMessage(
  error: unknown,
  overrides: ApiErrorMessageOverrides = {},
): string {
  return getApiErrorDetails(error, overrides).message;
}