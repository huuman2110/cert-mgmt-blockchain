import en from "./en.json";
import vi from "./vi.json";

export const LANGUAGES_SUPPORTED = {
  vi: "vi",
  en: "en",
};

export const messages = {
  [LANGUAGES_SUPPORTED.en]: en,
  [LANGUAGES_SUPPORTED.vi]: vi,
};
