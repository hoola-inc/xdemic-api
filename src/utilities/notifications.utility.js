const webPush = require('web-push');

webpush.setGCMAPIKey(process.env.GOOGLE_API_KEY);
webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY);