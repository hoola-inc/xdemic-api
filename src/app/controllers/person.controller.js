'use strict'

const PersonSchema = require('../models/person.model');
const jwtSigner = require('../../utilities/jwt-signature-generator');
const transports = require('uport-transports').transport;
const { Credentials } = require('uport-credentials');
const StudentSchooolModel = require('../models/student-school-bridge.model');
const nodemailer = require('nodemailer');
const ipfsLink = require('../../constants/main.constant').ipfsLink;
const courseSchema = require('../models/course.model');
const writeFile = require('../../utilities/write-to-file.utility');
const addToIPFS = require('../../utilities/ipfs-add-file.utility');
const saveCredentials = require('../../utilities/save-credentials');
const encryptMessage = require('../../utilities/encryption.utility');
const csvReader = require('../../utilities/csv.utility');

exports.createPerson = async (req, res, next) => {
    try {
        // TODO change here for req timeout...
        req.setTimeout(120000);

        //saving did and prvKey in credentials collection
        const newCredentials = await saveCredentials.saveNewCredentials();
        const did = newCredentials.did;


        const addNewPerson = new PersonSchema(req.body);
        addNewPerson.did = did;

        const createNewPerson = await addNewPerson.save();
        const isWritten = await writeFile.writeToFile(did, 'persons', createNewPerson);
        // const path = require('path').join(__dirname, `../../../public/files/persons/${did}.json`);
        // const ipfsFileHash = await addToIPFS.addFileIPFS(did, path);

        return res.status(200).json({
            status: true,
            data: createNewPerson,
            // ipfs: ipfsLink.ipfsURL + ipfsFileHash
        });
    } catch (error) {
        next(error);
    }
}

exports.getAllPersons = async (req, res, next) => {
    try {
        const persons = await PersonSchema.find();
        if (persons.length > 0) {
            return res.status(200).json({
                status: true,
                data: persons
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'no record found'
            })
        }
    } catch (error) {
        next(error);
    }
}

exports.csvFile = async (req, res, next) => {
    try {
        const fileName = req.file.filename;
        const csvData = await csvReader.readCSV(fileName);
        next(csvData);
    } catch (error) {
        next(error);
    }
}