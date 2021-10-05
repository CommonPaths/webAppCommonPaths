// const { NotAcceptable } = require('http-errors'); // TODO
// const { keys } = require('lodash');
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');
const fs = require('fs');
const CryptoJS = require('crypto-js');
const multer = require('multer');
const accessControlService = require('../services/accessControlService');

const tmpLayerGeoJSONFilesFolderPath = './public/customLayerGeoJSONFilesFolder'; // Tmp folder to upload GeoJSON files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpLayerGeoJSONFilesFolderPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

function readcustomLayerGeoJSONfiles() {
  const customLayerGeoJSONFilesFolderPath = `${tmpLayerGeoJSONFilesFolderPath}/`;
  const customLayerGeoJSONFileNames = fs.readdirSync(customLayerGeoJSONFilesFolderPath);
  let geoJSONDataElement = {};
  let geoJSONData = [];

  for (let i = 0; i < customLayerGeoJSONFileNames.length; i += 1) {
    geoJSONDataElement.fileName = customLayerGeoJSONFileNames[i];
    if (geoJSONDataElement.fileName.split('.')[1] === 'geojson') {
      geoJSONDataElement.fileData = JSON.parse(
        fs.readFileSync(customLayerGeoJSONFilesFolderPath + customLayerGeoJSONFileNames[i]),
      );
      geoJSONData.push(geoJSONDataElement);
      geoJSONDataElement = {};
      fs.unlinkSync(customLayerGeoJSONFilesFolderPath + customLayerGeoJSONFileNames[i]);
    }
  }
  return geoJSONData;
}

// Key2 x number of characters random generator: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

function cipherCrypt(key1, key3, osmUserPass) {
  const key = `${key1}g~zdY65${key3}`;
  const cipheredtext = CryptoJS.AES.encrypt(osmUserPass, key).toString();
  return cipheredtext;
}

function cipherDeCrypt(key1, key3, cipheredPass) {
  const key = `${key1}g~zdY65${key3}`;
  const bytes = CryptoJS.AES.decrypt(cipheredPass, key);
  const osmUserPass = bytes.toString(CryptoJS.enc.Utf8);
  return osmUserPass;
}

function buildAttributes(settingsId, reqBody, cipheredPass, GeoJSONfilesData) {
  const attributes = {
    id: settingsId,
    otpEndpoint: reqBody.otpEndpoint,
    osmEndpoint: reqBody.osmEndpoint,
    geocoderEndpoint: reqBody.geocoderEndpoint,
    osmUsername: reqBody.osmUsername,
    osmUserCipher: cipheredPass,
    bingMapKey: reqBody.bingMapKey,
    bbox: [reqBody.bboxLeft, reqBody.bboxBottom, reqBody.bboxRight, reqBody.bboxTop],
    cognitoRegion: reqBody.cognitoRegion, // ToDo Delete/keep depending on MultiTenant Configuration
    cognitoUserPoolId: reqBody.cognitoUserPoolId,
    cognitoTokenExpiration: reqBody.cognitoTokenExpiration,
    cognitoClientId: reqBody.cognitoClientId,
    s3AccessKeyId: reqBody.s3AccessKeyId,
    s3SecretAccessKey: reqBody.s3SecretAccessKey,
    s3BucketName: reqBody.s3BucketName,
    transportTileLayerKey: reqBody.transportTileLayerKey,
    customTileLayerName: reqBody.customTileLayerName,
    mapboxAccountName: reqBody.mapboxAccountName,
    mapboxAccountStyleID: reqBody.mapboxAccountStyleID,
    mapboxAccountKey: reqBody.mapboxAccountKey,
    userSettings: GeoJSONfilesData,
  };
  return attributes;
}

// GET index/landing-page for settings.
exports.index_get = function settingsController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'settings');
  if (permission.granted) {
    res.render('settings');
  } else {
    res.status(403).end();
  }
};

// GET general for settings.
exports.general_get = function settingsController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'settings');
  let osmUserPass = '';
  if (permission.granted) {
    req.database.SettingModel.findByPk(1)
      .then((settingsRecord) => {
        if (settingsRecord !== null) {
          osmUserPass = cipherDeCrypt(
            process.env.PASS_CIPHER_KEY,
            JSON.stringify(settingsRecord.createdAt),
            settingsRecord.osmUserCipher,
          );
        }
        res.render('generalSettings', {
          generalSettingsData: settingsRecord,
          osmUserPass,
          getLoggedUserRole: req.signedCookies.token.officer_role,
          bboxLeft: (settingsRecord === null) ? '' : settingsRecord.bbox[0],
          bboxBottom: (settingsRecord === null) ? '' : settingsRecord.bbox[1],
          bboxRight: (settingsRecord === null) ? '' : settingsRecord.bbox[2],
          bboxTop: (settingsRecord === null) ? '' : settingsRecord.bbox[3],
        });
      });
  } else {
    res.status(403).end();
  }
};

// POST general for settings.
exports.general_post = function settingsController(req, res) {
  const upload = multer({ storage }).array('geoJSONFiles', 7); // Middleware to parse a multipart form with file transfer
  upload(req, res, (err) => {
    if (err) {
      res.render('generalSettings', { s_status: 'Error Updating Record' });
    } else {
      const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'settings');
      if (permission.granted) {
        const osmUserCipher = cipherCrypt(
          process.env.PASS_CIPHER_KEY,
          JSON.stringify(req.body.createdAt),
          req.body.osmUserPass,
        );
        // Note Settings Table has only one row record with PK=1
        const attributes = buildAttributes('1', req.body, osmUserCipher, readcustomLayerGeoJSONfiles());
        req.database.SettingModel.upsert(attributes).then((result) => {
          res.render('generalSettings', { generalSettingsData: result[0], s_status: 'Record Updated' });
        });
      } else {
        res.status(403).end();
      }
    }
  });
};
