/* eslint-disable @typescript-eslint/no-explicit-any */
import { authKey } from "@/contains/authKey";
import { decodedToken } from "@/utils/jwt";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "@/utils/local-storage";

import { logoutUser } from "./actions/logoutUser";

// ── Auth helpers ─────────────────────────────────────────────────────────────
export const storeUserInfo = ({ accessToken }: { accessToken: string }) => {
  setToLocalStorage(authKey, accessToken);
};

export const getUserInfo = () => {
  const authToken = getFromLocalStorage(authKey);
  if (authToken) {
    const decodedData: any = decodedToken(authToken);
    return {
      ...decodedData,
      role: decodedData?.role?.toLowerCase(),
    };
  }
  return null;
};

export const isLoggedIn = () => {
  const authToken = getFromLocalStorage(authKey);
  if (!authToken) return false;

  try {
    const user = getUserInfo();
    const isExpired = typeof user?.exp === "number" && user.exp * 1000 <= Date.now();
    const isGuest = user?.isGuest === true || String(user?.email ?? "").endsWith("@guest.invalid");

    // A guest checkout token is temporary and must not make later visits
    // behave like an authenticated user's cart session.
    return Boolean(user && !isExpired && !isGuest);
  } catch {
    removeFromLocalStorage(authKey);
    return false;
  }
};

export const removeUser = () => {
  removeFromLocalStorage(authKey);
  logoutUser();
};
