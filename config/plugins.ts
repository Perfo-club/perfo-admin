export default () => ({
  "users-permissions": {
    config: {
      register: {
        allowedFields: ["enclosure_name", 'phone'],
      },
    },
  },
  'qrcode-generator': {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: 'api::cam.cam',
          targetField: 'token ',
          frontend: {
            basePath: '/record',
          },
        },
      ],
    },
  },
});
