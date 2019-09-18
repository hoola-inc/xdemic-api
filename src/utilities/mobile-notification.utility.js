// todo uncomment

// const transports = require('uport-transports').transport;
// const { Credentials } = require('uport-credentials');



// const credentials = new Credentials({
//     appName: 'Xdemic',
//     did: 'did:ethr:0xd741a6dd2711521e8798fbe92c12fcb9d2f43cf1',
//     privateKey: '8986bea04ec687c45be90c5a6e259dbf125291f3a8ede0b595442c39d3322875'
// });

// function sendNotificationToMobileApp(pushToken, boxPub, data) {
//     const push = transports.push.send(pushToken, boxPub);

//     credentials.createVerification({
//         sub: 'Course Credentials',
//         exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
//         claim: data
//         // Note, the above is a complex (nested) claim. 
//         // Also supported are simple claims:  claim: {'Key' : 'Value'}
//     }).then(attestation => {
//         console.log(`Encoded JWT sent to user: ${attestation}`);
//         console.log(`Decodeded JWT sent to user: ${JSON.stringify(decodeJWT(attestation))}`);
//         return push(attestation); // *push* the notification to the user's mobile app.
//     }).then(res => {
//         console.log(res);
//         console.log('Push notification sent and should be recieved any moment...');
//         console.log('Accept the push notification in the xdemic mobile application');
//     })
//         .catch(err => {
//             console.log(err);
//         });
// }

// module.exports = sendNotificationToMobileApp;