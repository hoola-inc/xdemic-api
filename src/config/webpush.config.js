const webpush = require('web-push');

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
const email = process.env.EMAIL;

webpush.setVapidDetails(`mailto:${email}`, publicVapidKey, privateVapidKey);