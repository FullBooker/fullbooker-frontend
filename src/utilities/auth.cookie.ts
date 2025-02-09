import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

export const TOKEN_KEY = "fullbooker-auth";
const ENCRYPTION_SECRET = "base64:ssrzj+9i94HpNXm0zgXyijec3DxbDdETLOCq7Xagyvo=";

export const saveToken = (token: string, maxAgeInSeconds: number): void => {
  const encryptedToken = encryptToken(token, ENCRYPTION_SECRET);
  const maxAgeInDays = maxAgeInSeconds / (60 * 60 * 24);

  Cookies.set(TOKEN_KEY, encryptedToken.toString(), {
    secure: process.env.NODE_ENV === "development" ? false : true,
    expires: maxAgeInDays,
  });
};

export const getToken = (): string | null => {
  // Retrieve the encrypted token from the secure cookie
  const encryptedToken = Cookies.get(TOKEN_KEY);

  if (encryptedToken) {
    // Decrypt the token using AES decryption
    const decryptedToken = decryptToken(encryptedToken, ENCRYPTION_SECRET);

    return decryptedToken;
  }

  return null;
};

export const removeToken = (): void => {
  // Remove the token from the secure cookie
  Cookies.remove(TOKEN_KEY);
};

const encryptToken = (token: string, secretKey: string): string => {
  // Encrypt the token using AES encryption with the secret key
  const encrypted = CryptoJS.AES.encrypt(token, secretKey);
  return encrypted.toString();
};

const decryptToken = (encryptedToken: string, secretKey: string): string => {
  // Decrypt the token using AES decryption with the secret key
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
  const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedToken;
};
