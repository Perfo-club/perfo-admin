/**
 * `check-wh-is-firmed` middleware
 */

const crypto = require('crypto');

export default () => {
  return async (ctx, next) => {
    const payload = JSON.stringify(ctx.request.body)
    const hash = crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET)
      .update(payload)
      .digest('base64')


    if(process.env.NODE_ENV !== 'production'){
      console.log('HASH======>', hash) 
    }


    if(hash === ctx.request.header['x-perfo-signature']){
      return next();
    }
    return ctx.unauthorized('Not allowed, missing secret.')

  };
};
