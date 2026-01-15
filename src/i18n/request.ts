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
    dashboard,
    login,
    profile,
    foundation,
    navigation,
    animals,
    adopt,
    adoptDetail,
    shop,
    products,
    productForm,
    adoptionsAdmin,
  ] = await Promise.all([
    import(`../messages/${locale}/common.json`),
    import(`../messages/${locale}/home.json`),
    import(`../messages/${locale}/register.json`),
    import(`../messages/${locale}/dashboard.json`),
    import(`../messages/${locale}/login.json`),
    import(`../messages/${locale}/profile.json`),
    import(`../messages/${locale}/foundation.json`),
    import(`../messages/${locale}/navigation.json`),
    import(`../messages/${locale}/animals.json`),
    import(`../messages/${locale}/adopt.json`),
    import(`../messages/${locale}/adopt-detail.json`),
    import(`../messages/${locale}/shop.json`),
    import(`../messages/${locale}/products.json`),
    import(`../messages/${locale}/product-form.json`),
    import(`../messages/${locale}/adoptions-admin.json`),
  ]);

  return {
    locale,
    messages: {
      common: common.default,
      home: home.default,
      register: register.default,
      dashboard: dashboard.default,
      login: login.default,
      profile: profile.default,
      foundation: foundation.default,
      navigation: navigation.default,
      animals: animals.default,
      adopt: adopt.default,
      adoptDetail: adoptDetail.default,
      shop: shop.default,
      products: products.default,
      productForm: productForm.default,
      adoptionsAdmin: adoptionsAdmin.default,
    },
  };
});
