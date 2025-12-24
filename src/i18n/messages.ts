import common from "../messages/en/common.json";
import home from "../messages/en/home.json";
import register from "../messages/en/register.json";

export const messages = {
  common,
  home,
  register,
};

export type AppMessages = typeof messages;

declare module "next-intl" {
  interface AppConfig {
    Messages: AppMessages;
  }
}
