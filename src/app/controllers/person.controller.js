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
const encryption = require('../../utilities/encryption.utility');
const csvReader = require('../../utilities/csv.utility');
const response = require('../../utilities/response.utils');



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
        persons.length > 0 ? response.SUCCESS(res, persons) : response.NOTFOUND(res);
    } catch (error) {
        next(error);
    }
}

exports.csvFile = async (req, res, next) => {
    try {
        const fileName = req.file.filename;
        const csvData = await csvReader.readCSV(fileName);
        response.SUCCESS(res, csvData);
    } catch (error) {
        next(error);
    }
}

exports.blockPerson = async (req, res, next) => {
    try {
        const did = req.params.did;
        const updateObject = {
            isBlocked: req.body.isBlocked
        };
        await PersonSchema.updateOne({ did: did }, { $set: updateObject }, { runValidators: true });
        const data = await PersonSchema.findOne({ did: did });
        const encryptedData = await encryption.encryptMessage('data', 'R/eYP0EyEBo5EpKEt6DpGEFGWwd17MQznB0YmW3b3kU=');
        console.log(encryptedData);
        response.SUCCESS(res, data);
    } catch (error) {
        next(error);
    }
}

exports.editPerson = async (req, res, next) => {
    try {
        const did = req.params.did;
        await PersonSchema.updateOne({ did: did }, { $set: req.body });
        const data = await PersonSchema.findOne({ did: did });
        response.SUCCESS(res, data);
    } catch (error) {
        next(error);
    }
}

exports.deletePerson = async (req, res, next) => {
    try {
        const did = req.params.did;
        await PersonSchema.deleteOne({ did: did });
        response.DELETE(res);
    } catch (error) {
        next(error);
    }
}