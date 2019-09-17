const webpush = require('web-push');

exports.sendNotification = (data) => {
    const subscription = data;
    // res.status(201).json({});
    const payload = JSON.stringify({ title: 'test' });
    console.log('printing subscription');
    console.log(subscription);

    webpush.sendNotification(subscription, payload).catch(error => {
        console.error(error.stack);
    });
}