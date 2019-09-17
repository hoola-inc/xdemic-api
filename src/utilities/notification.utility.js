const webpush = require('web-push');

exports.sendNotification = (data) => {
    const subscription = data;
    // res.status(201).json({});
    const payload = JSON.stringify({ title: 'test' });

    console.log(subscription);

    webpush.sendNotification(subscription, payload)
    .then(data => {
        console.log('inside then i am working');
        console.log(data)
    })
    .catch(error => {
        console.error(error.stack);
    });
}