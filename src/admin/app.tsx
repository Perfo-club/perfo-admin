import logo from "./extensions/faviconPerfoLogo.png";

export default {
  config: {
    notifications: {
      releases: false
    },
    tutorials: false,
    head: {
      favicon: logo,
    },
    auth:{
      logo
    },
    menu: {
      logo
    },
    translations: {
      //https://github.com/strapi/strapi/blob/main/packages/core/admin/admin/src/translations/es.json
      en: {
        "app.components.LeftMenu.navbrand.title": "Perfo Dashboard",
        "Auth.form.welcome.subtitle": "Log-in into your Perfo account",
        "app.components.HomePage.welcomeBlock.content.again": "Welcome to the  Perfo.club admin",
      },
      es: {
        "app.components.LeftMenu.navbrand.title": "Panel de control Perfo",
        "Auth.form.welcome.subtitle": "Inicie sesión en su cuenta de Perfo",
        "app.components.HomePage.welcomeBlock.content.again": "Bienvenido al admin de Perfo.club",
      },
    },

    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
  },
  bootstrap(app) {
    console.log(app);
  },
};
