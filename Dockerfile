FROM node:10.17.0

# Create app directory
WORKDIR /src

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

ENV NODE_ENV=development
ENV PORT=8080
# Set your database/API connection information here
ENV DB_URL=mongodb+srv://xdemic:xdemic123@api-dev-cnwch.mongodb.net/test?retryWrites=true&w=majority
#Email
ENV EMAIL=incxdemic@gmail.com
ENV PASSWORD=123Xdemic123
# change when deploy on server
ENV BASE_URL=http://localhost:8080/
# web push notifications key
ENV Student_Transcript_URL=https://xdemic-student-transcrip-cde91.firebaseapp.com
# JWT secret
ENV SECRET=123XdemiC123
# Credentials Setup
ENV APP_NAME=Xdemic
ENV SERVER_DID=did:ethr:0xd741a6dd2711521e8798fbe92c12fcb9d2f43cf1
ENV SERVER_PRIVATEKEY=8986bea04ec687c45be90c5a6e259dbf125291f3a8ede0b595442c39d3322875
# IPFS BASE URL
ENV IPFS_BASE_URL=https://ipfs.infura.io:5001/api/v0/cat?arg=
# encryption
ENV BLOCK_SIZE=64
ENV ASYNC_ENC_ALGORITHM=x25519-xsalsa20-poly1305
# for notifications
ENV PUBLIC_VAPID_KEY=BPLQpcEBiyh9Y4vBF0WmRLSHaM-Ia8b3Cf0VsDkcKozyIXcIydVLCfgYwAG91tHl8C2tcm6Tt3cFeEL8_w7SD0w
ENV PRIVATE_VAPID_KEY=gE6Yj5Qf0c7jrS3uDTk5kkH4s38J4ts080lT0TJIWLw
ENV GOOGLE_API_KEY=AIzaSyAfj5bQAvuyx-LIuZuRxGkMNkvlGkuy2QE 
ENV WEB_PUSH_CONTACT=mailto:incxdemic@gmail.com

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]