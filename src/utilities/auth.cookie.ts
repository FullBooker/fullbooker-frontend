import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

export const AUTH_TOKEN_KEY = "fullbooker-auth";
export const ANOMYMOUS_TOKEN_KEY = "anonymous-auth";
const ENCRYPTION_SECRET = "base64:ssrzj+9i94HpNXm0zgXyijec3DxbDdETLOCq7Xagyvo=";

export const saveToken = (token: string, maxAgeInSeconds: number): void => {
  const encryptedToken = encryptToken(token, ENCRYPTION_SECRET);
  const maxAgeInDays = maxAgeInSeconds / (60 * 60 * 24);

  Cookies.set(AUTH_TOKEN_KEY, encryptedToken.toString(), {
    secure: process.env.NODE_ENV === "development" ? false : true,
    expires: maxAgeInDays,
  });
};

export const getToken = (): string | null => {
  const encryptedToken = Cookies.get(AUTH_TOKEN_KEY);
  if (encryptedToken) {
    const decryptedToken = decryptToken(encryptedToken, ENCRYPTION_SECRET);

    return decryptedToken;
  }

  return null;
};

export const removeToken = (): void => {
  Cookies.remove(AUTH_TOKEN_KEY);
};

export const saveAnonymousAuthToken = (
  token: string,
  maxAgeInSeconds: number
): void => {
  const encryptedToken = encryptToken(token, ENCRYPTION_SECRET);
  const maxAgeInDays = maxAgeInSeconds / (60 * 60 * 24);

  Cookies.set(ANOMYMOUS_TOKEN_KEY, encryptedToken.toString(), {
    secure: process.env.NODE_ENV === "development" ? false : true,
    expires: maxAgeInDays,
  });
};

export const getAnonymousAuthToken = (): string | null => {
  const encryptedToken = Cookies.get(ANOMYMOUS_TOKEN_KEY);
  if (encryptedToken) {
    const decryptedToken = decryptToken(encryptedToken, ENCRYPTION_SECRET);

    return decryptedToken;
  }

  return null;
};

export const removeAnonymousAuthToken = (): void => {
  Cookies.remove(ANOMYMOUS_TOKEN_KEY);
};

const encryptToken = (token: string, secretKey: string): string => {
  const encrypted = CryptoJS.AES.encrypt(token, secretKey);
  return encrypted.toString();
};

const decryptToken = (encryptedToken: string, secretKey: string): string => {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
  const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedToken;
};
