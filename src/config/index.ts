export const isDevEnv = process.env.NODE_ENV === "development";
export const API_URL = isDevEnv
  ? process.env.REACT_APP_PROXY_TARGET as string
  : process.env.REACT_APP_PROXY_TARGET_OF_PUBLIC as string;
export const BASE_API_URL = process.env.REACT_APP_BASE_API;
export const isMock = isDevEnv && process.env.REACT_APP_API_MOCKING === "true";
export const hCaptchaSitekey: string = process.env.REACT_APP_HCAPTCHA_SITEKEY || '';
// export * as locale from "./locale";
export { default as locale } from "./locale.en";

