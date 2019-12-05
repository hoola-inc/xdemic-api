'use strict'

const SchoolSchema = require('../models/school.model');
const CredentialSchema = require('../models/credentials.model');
const sendJWt = require('../../utilities/jwt-signature-generator');
const saveCredentials = require('../../utilities/save-credentials');
const writeFile = require('../../utilities/write-to-file.utility');
const addToIPFS = require('../../utilities/ipfs-add-file.utility');
const ipfsLink = require('../../constants/main.constant').ipfsLink;
const jwtSignature = require('../../utilities/jwt-signature-generator');
const fs = require('fs');
const updateArrayHelper = require('../../utilities/helpers/update-array.helper');

exports.createSchool = async (req, res, next) => {

    try {
        
        //saving did and prvKey in credentials collection
        const newCredentials = await saveCredentials.saveNewCredentials();
        const did = newCredentials.did;

        const newSchool = new SchoolSchema(req.body);
        // setting school did
        newSchool.did = did;
        const createNewSchool = await newSchool.save();

        // waiting to write file with new school data
        await writeFile.writeToFile(did, 'schools', createNewSchool);
        // hosting to ipfs 
        // const path = require('path').join(__dirname, `../../../public/files/schools/${did}.json`);
        // const ipfsFileHash = await addToIPFS.addFileIPFS(did, path);
        return res.status(200).json({
            status: true,
            data: createNewSchool,
            // ipfs: ipfsLink.ipfsURL + ipfsFileHash
        });
    } catch (error) {
        next(error);
    }
};

exports.getSchool = async (req, res, next) => {
    try {
        const getSchools = await SchoolSchema.find();
        if (getSchools.length > 0) {
            const schoolDataHash = await jwtSignature.jwtSchema(process.env.SERVER_DID, getSchools);
            return res.status(200).json({
                status: true,
                data: schoolDataHash
            });
        } else {
            return res.status(200).json({
                status: false,
                message: 'no record found'
            });
        }
    } catch (error) {
        next(error);
    }
};



// exports.createSchool = async (req, res, next) => {
//     const school = await schoolExist(req);
//     try {
//         if (school) {
//             return res.status(200).json({
//                 status: false,
//                 message: 'school already exist'
//             })
//         } else {
//             let did = didGenerator.did;
//             let prvKey = didGenerator.privateKey;
//             const creatNewCredentials = new CredentialSchema({
//                 did: did,
//                 privateKey: prvKey
//             });

//             creatNewCredentials.save()
//                 .then(data => {
//                     const newSchool = new SchoolSchema({
//                         name: req.body.name,
//                         subjectWebpage: req.body.subjectWebpage,
//                         address: req.body.address,
//                         offers: req.body.offers,
//                         agentSectorType: req.body.agentSectorType,
//                         agentType: req.body.agentType,
//                         email: req.body.email,
//                         did: did,
//                         telephone: req.body.telephone
//                     });
//                     newSchool.save()
//                         .then(data => {
//                             writeToFile(data, res);
//                         })
//                         .catch(err => {
//                             next(err.message);
//                         })
//                 })
//                 .catch(err => {
//                     next(err.message);
//                 })
//         }
//     } catch (error) {
//         next(error.message);
//     }
// }

// const schoolExist = async (req) => {
//     try {
//         const checkschool = await SchoolSchema.find({
//             name: req.body.name
//         });
//         if (checkschool.length > 0) {
//             return true
//         } else {
//             return false;
//         }
//     } catch (error) {
//         throw new Error('an error occured while fetching school from db', error.message);
//     }
// }

// const writeToFile = (schoolData, res) => {
//     try {
//         const path = require('path').join(__dirname, '../../../http-files/schools/school.json');
//         fs.readFile(path, 'utf8', function readFileCallback(err, data) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 obj = JSON.parse(data); //now it an object
//                 writeObjToFile(obj, schoolData);
//                 json = JSON.stringify(obj); //convert it back to json
//                 fs.writeFile(path, json, 'utf8', (err) => {
//                     if (err) {
//                         throw new Error('Error occured while writing to file')
//                     } else {
//                         return res.status(200).json({
//                             status: true,
//                             data: schoolData,
//                             schoolHostURL: process.env.BASE_URL + "httpschool",
//                             message: "Successfully created and write to file"
//                         })
//                     }
//                 }); // write it back
//             }
//         });
//     } catch (error) {
//         throw new Error('an error occured while parsing json school file', error.message);
//     }
// }

// const writeObjToFile = (obj, schoolData) => {
//     const schoolFileAddress = {
//         "id": "did:ethr:0x47968f7416ee34f62550fedf4cb8252439ac22d7",
//         "type": "ceterms:PostalAddress",
//         "ceterms:addressCountry": "US",
//         "ceterms:addressRegion": "CA",
//         "ceterms:addresssLocality": "Santa Rosa",
//         "ceterms:postalCode": "95401-4395",
//         "ceterms:streetAdddess": "1501 Mendocino Ave."
//     };

//     let schoolFileObj = {
//         "id": "did:ethr:0x47968f7416ee34f62550fedf4cb8252439ac22d7",
//         "type": "ceterms:CredentialOrganization",
//         "ceterms:name": {
//             "language": "en-US",
//             "value": schoolData.name
//         },
//         "ceterms:address": {
//             "id": schoolData.address
//         },
//         "ceterms:subjectWebpage": {
//             "id": schoolData.subjectWebpage
//         },
//         "ceterms:offers": {
//             "id": schoolData.offers
//         }
//     }
//     obj.graph.push(schoolFileObj, schoolFileAddress);
// }

// exports.getSchool = (req, res, next) => {
//     SchoolSchema.find()
//         .then(data => {
//             if (data.length > 0) {
//                 res.status(200).json({
//                     status: true,
//                     length: data.length,
//                     data: data
//                 })
//             } else {
//                 res.status(200).json({
//                     status: false,
//                     message: 'not record found'
//                 })
//             }
//         })
//         .catch(err => {
//             next(err.message)
//         })
// }


exports.getSchoolWithStudent = (req, res, next) => {

    // todo cahnge here 
    // SchoolSchema.find({
    //     "student.studentDID": req.params.did
    // })
    const schoolDID = req.params.did;
    SchoolSchema.find({
        did: schoolDID
    })
        .then(data => {
            console.log(data);
            if (data.length > 0) {
                return res.status(200).json({
                    status: true,
                    data: data
                })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'no student enroll with school yet'
                })
            }
        })
        .catch(err => {
            next(err.message);
        })
}

exports.getSchoolWithSignedJWT = (req, res, next) => {
    SchoolSchema.find()
        .then(data => {
            if (data.length > 0) {
                sendJWt.jwtSchema('did:ethr:0xa056ffbfd644e482ad8d722c4be4c66aa052ad5a', data)
                    .then(signedJwt => {
                        return res.status(200).send({
                            status: true,
                            data: signedJwt
                        })
                    })
                    .catch(err => {
                        next(err.message)
                    })
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'no record found'
                });
            }
        })
        .catch(err => {
            next(err.message);
        })
}
