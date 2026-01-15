import common from "../messages/en/common.json";
import dashboard from "../messages/en/dashboard.json";
import foundation from "../messages/en/foundation.json";
import home from "../messages/en/home.json";
import login from "../messages/en/login.json";
import navigation from "../messages/en/navigation.json";
import profile from "../messages/en/profile.json";
import register from "../messages/en/register.json";
import animals from "../messages/en/animals.json";
import adopt from "../messages/en/adopt.json";
import adoptDetail from "../messages/en/adopt-detail.json";
import adoptRequest from "../messages/en/adopt-request.json";
import shop from "../messages/en/shop.json";
import shopDetail from "../messages/en/shop-detail.json";
import products from "../messages/en/products.json";
import productForm from "../messages/en/product-form.json";

export const messages = {
  common,
  dashboard,
  foundation,
  home,
  login,
  navigation,
  profile,
  register,
  animals,
  adopt,
  adoptDetail,
  adoptRequest,
  shop,
  shopDetail,
  products,
  productForm,
};

export type AppMessages = typeof messages;

declare module "next-intl" {
  interface AppConfig {
    Messages: AppMessages;
  }
}
