import axios from "axios";

import type { ApiErrorMessageOverrides } from "../types";

// Checks if the given error is an Axios error with a specific HTTP status code.
export function hasApiStatus(error: unknown, status: number): boolean {
  return axios.isAxiosError(error) && error.response?.status === status;
}

export function getApiErrorMessage(
  error: unknown,
  overrides: ApiErrorMessageOverrides = {},
): string {
  const {
    timeout = "La solicitud tardó demasiado. Intente nuevamente.",
    noResponse = "No se recibió respuesta del servidor. Verifique su conexión.",
    conflict = "Ya existe un conflicto con el recurso solicitado.",
    fallback = "Ocurrió un problema al procesar la solicitud. Intente nuevamente.",
  } = overrides;

  // If the error is not from Axios (e.g. a plain JS Error or an unknown throw),
  // return its message if it has one, otherwise fall back to the default message.
  if (!axios.isAxiosError(error)) {
    return error instanceof Error && error.message
      ? error.message
      : fallback;
  }

  if (error.code === "ECONNABORTED") {
    return timeout;
  }

  if (error.response?.status === 409) {
    return conflict;
  }

  if (!error.response && error.request) {
    return noResponse;
  }

  const serverMessage = error.response?.data?.message;

  if (typeof serverMessage === "string" && serverMessage.trim().length > 0) {
    return serverMessage;
  }

  return fallback;
}
