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
    translations: {
      'es': {
        Users: 'Usuarios',
        Cam: 'Dispositivos',
        Enclosure: 'Establecimientos',

      }
    }
  },
  bootstrap(app) {
    console.log(app);
  },
};
