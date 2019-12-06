/**
 * No Use YET
 */

const { Credentials } = require('uport-credentials')
const blake = require('blakejs')

const { did, privateKey } = Credentials.createIdentity();
const credentials = new Credentials({
    appName: 'Test', did, privateKey
})

const id2 = Credentials.createIdentity();
const did2 = id2.did
const privateKey2 = id2.privateKey

const credentials2 = new Credentials({
    appName: 'Test2', did: did2, privateKey: privateKey2
})


const f = (async () => {
    //Create AuthToken
    const authTokenPL = {
        sub: did,
        claim: {
            access: []
        }
    }
    const authToken = await credentials.signJWT(authTokenPL)

    //Create Edge JWT
    const edgePayload = {
        sub: did,
        type: 'ALL',
        vis: 'ANY',
        tag: 'test',
        data: 'anyData'
    }
    const edgeJWT = await credentials2.signJWT(edgePayload);
    const edgeHash = blake.blake2bHex(edgeJWT);

    //Create Edge JWT with AUD
    const edgeAudPayload = {
        sub: did,
        type: 'ALL',
        vis: 'ANY',
        tag: 'test',
        data: 'anyData',
        aud: did
    }
    const edgeAudJWT = await credentials2.signJWT(edgeAudPayload);
    const edgeAudHash = blake.blake2bHex(edgeAudJWT);


    //Create AuthzToken
    const authzPL = {
        sub: did2,
        claim: {
            action: 'read',
            condition: {
                from: did2
            }
        }
    }
    const authzToken = await credentials.signJWT(authzPL);
    //Create AuthToken2
    const authToken2PL = {
        sub: did2,
        claim: {
            access: [authzToken]
        }
    }
    const authToken2 = await credentials2.signJWT(authToken2PL)

    //Env Vars
    const envVars = {
        mouroUrl: process.argv[2],
        authToken: authToken,
        did: did,
        did2: did2,
        edgeJWT: edgeJWT,
        edgeHash: edgeHash,
        edgeAudJWT: edgeAudJWT,
        edgeAudHash: edgeAudHash,
        authToken2: authToken2

    }

    const envId = (new Date()).getTime()
    let env = {
        id: envId,
        name: envId,
        values: []
    };
    for (const key in envVars) {
        env.values.push({ key: key, value: envVars[key] })
    }
    // console.log(JSON.stringify(env,null,3));
    const d = JSON.stringify(env);
    return d;
})();

module.exports = {
    a: f
}