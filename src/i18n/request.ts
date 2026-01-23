import { getRequestConfig } from "next-intl/server";

import { defaultLocale, locales } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as (typeof locales)[number])) {
    locale = defaultLocale;
  }

  const [
    common,
    home,
    register,
    legal,
    dashboard,
    login,
    profile,
    foundation,
    navigation,
    animals,
    adopt,
    adoptDetail,
    adoptRequest,
    shop,
    shopDetail,
    products,
    productForm,
    adoptionsAdmin,
    storage,
  ] = await Promise.all([
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/home.json`),
    import(`../messages/${locale}/register.json`),
    import(`../messages/${locale}/legal.json`),
    import(`../messages/${locale}/dashboard.json`),
    import(`../messages/${locale}/login.json`),
    import(`../messages/${locale}/profile.json`),
    import(`../messages/${locale}/foundation.json`),
    import(`../messages/${locale}/navigation.json`),
    import(`../messages/${locale}/animals.json`),
    import(`../messages/${locale}/adopt.json`),
    import(`../messages/${locale}/adopt-detail.json`),
    import(`../messages/${locale}/adopt-request.json`),
    import(`../messages/${locale}/shop.json`),
    import(`../messages/${locale}/shop-detail.json`),
    import(`../messages/${locale}/products.json`),
    import(`../messages/${locale}/product-form.json`),
    import(`../messages/${locale}/adoptions-admin.json`),
    import(`../messages/${locale}/storage.json`),
  ]);

  return {
    locale,
    messages: {
      common: common.default,
      home: home.default,
      register: register.default,
      legal: legal.default,
      dashboard: dashboard.default,
      login: login.default,
      profile: profile.default,
      foundation: foundation.default,
      navigation: navigation.default,
      animals: animals.default,
      adopt: adopt.default,
      adoptDetail: adoptDetail.default,
      adoptRequest: adoptRequest.default,
      shop: shop.default,
      shopDetail: shopDetail.default,
      products: products.default,
      productForm: productForm.default,
      adoptionsAdmin: adoptionsAdmin.default,
      storage: storage.default,
    },
  };
});
