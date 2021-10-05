/* eslint-disable no-param-reassign */
// const { NotAcceptable } = require('http-errors'); // TODO
// const { keys } = require('lodash');
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');
"use strict";
const { Op } = require('sequelize');
const moment = require('moment');
const accessControlService = require('../services/accessControlService');
const KCMTenant = require('../services/KCMTenant');

function showParanoidRecords(loggedUserRole) {
  if (loggedUserRole === 'admin') { return false; }
  return true;
}

function promiseLookupCodes(req) {
  return req.database.LookupCodes.findAll({});
}

function promiseSettingsModel(req) {
  return req.database.SettingModel.findByPk(1);
}

function promiseFieldReviewModelAll(req) {
  return req.database.FieldReviewModel.findAll({})
}

function promiseADAPathwayAll(req) {
  return req.database.ADAPathwayModel.findAll({
    paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
    include: [{
      model: req.database.TripRequestModel,
      include: [
        { model: req.database.ClientProfileModel },
        { model: req.database.OfficerModel },
      ], // Join ADAPathways with TripRequests and Clients and Officers
    }],
  });
}


function promiseTripRequest(req) {
  return req.database.TripRequestModel.findAll({
    paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
    where: { id: req.params.id },
    include: [{ model: req.database.ClientProfileModel }, { model: req.database.OfficerModel }],
  });
}

function promiseDesktopReview(req) {
  return req.database.DesktopReviewModel.findAll({
    paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
    where: { tripRequestsId: req.params.id },
  });
}

function promiseFieldReview(req) {
  return req.database.FieldReviewModel.findAll({
    paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
    where: { tripRequestsId: req.params.id },
  });
}

function promiseADAPathway(req) {
  return req.database.ADAPathwayModel.findAll({
    paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
    where: { tripRequestsId: req.params.id },
  });
}

function promiseTripRequestsAll(req, trips, dateAdded) {
  return req.database.TripRequestModel.findAll({
    where: {
      [Op.and]: [
        { trips: { [Op.gte]: trips } },
        { DateAdded: dateAdded },
    ``],
    },
    paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
    include: [
      { model: req.database.ClientProfileModel },
      { model: req.database.OfficerModel },
      { model: req.database.DesktopReviewModel },
      { model: req.database.ADAPathwayModel },
    ],
    order: [
      ['updatedAt', 'DESC'],
    ],
  })
}

function buildAttributes(clientsId, reqBody) {
  const attributes = {
    clientsId,
    bookingId: (reqBody.bookingId === '') ? null : reqBody.bookingId,
    trips: reqBody.trips,
    pName: reqBody.pName.trim(),
    pAddr: reqBody.pAddr.trim(),
    pUnit: reqBody.pUnit ? reqBody.pUnit.trim() : '',
    pZip: reqBody.pZip,
    pCity: reqBody.pCity.trim(),
    pLat: reqBody.pLat === '' ? null : reqBody.pLat,
    pLon: reqBody.pLon === '' ? null : reqBody.pLon,
    pLatGeocode: reqBody.pLatGeocode === '' ? null : reqBody.pLatGeocode,
    pLonGeocode: reqBody.pLonGeocode === '' ? null : reqBody.pLonGeocode,
    proximityQuery: reqBody.proximityQuery === '' ? null : reqBody.proximityQuery,
    dName: reqBody.dName.trim(),
    dAddr: reqBody.dAddr.trim(),
    dUnit: reqBody.dUnit ? reqBody.dUnit.trim() : '',
    dZip: reqBody.dZip,
    dCity: reqBody.dCity.trim(),
    dLat: reqBody.dLat === '' ? null : reqBody.dLat,
    dLon: reqBody.dLon === '' ? null : reqBody.dLon,
    dLatGeocode: reqBody.dLatGeocode === '' ? null : reqBody.dLatGeocode,
    dLonGeocode: reqBody.dLonGeocode === '' ? null : reqBody.dLonGeocode,
    DateAdded: reqBody.DateAdded,
    daysOfWeekRequested: String(reqBody.daysOfWeekRequested).split(','),
    tripTime: reqBody.tripTime === '' ? null : reqBody.tripTime,
    appointmentTime: reqBody.appointmentTime === '' ? null : reqBody.appointmentTime,
    tripRequestType: reqBody.tripRequestType,
    priority: reqBody.priority,
    dateCompleted: reqBody.dateCompleted === '' ? null : reqBody.dateCompleted,
    status: reqBody.status,
    notes: reqBody.notes.trim(),
    officersId: reqBody.officersId,
  };
  return attributes;
}

function createBoundingBox(distanceInKMeters, geoCodeData) {
  const diffLatitude = (distanceInKMeters / 6378) * (180 / Math.PI);
  const diffLongitude = (distanceInKMeters / 6378) * (180 / Math.PI) / Math.cos(parseFloat(geoCodeData.lat) * Math.PI/180);
  const trLat = parseFloat(geoCodeData.lat) + diffLatitude;
  const trLon = parseFloat(geoCodeData.lon) + diffLongitude;
  const blLat = parseFloat(geoCodeData.lat) - diffLatitude;
  const blLon = parseFloat(geoCodeData.lon) - diffLongitude;

  return [ trLat, trLon, blLat, blLon ];
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lon2-lon1);
  const pLat = toRad(lat1);
  const pLat2 = toRad(lat2);

  const distance = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(pLat) * Math.cos(pLat2); 
  const arcDistance = 2 * Math.atan2(Math.sqrt(distance), Math.sqrt(1-distance));

  return (6378 * arcDistance) / 1.60934;
}

function toRad(deg) {
  return deg * Math.PI / 180;
}

function checkIfInsideBoundingBox(tripRequests, trLat, trLon, blLat, blLon, type) {
  if((type === 'Origin' && tripRequests.pLat >= blLat && tripRequests.pLat <= trLat && tripRequests.pLon >= blLon && tripRequests.pLon <= trLon) || (type === 'Destination' && tripRequests.dLat >= blLat && tripRequests.dLat <= trLat && tripRequests.dLon >= blLon && tripRequests.dLon <= trLon)) {
    return true;
  } 
  return false;
}

// eslint-disable-next-line max-len
function getFilteredTripRequests(tripRequests, geoCodeData, proximitySearch, trLat, trLon, blLat, blLon) {
  const filteredTripRequests = [];

  for (let i = 0; i < tripRequests.length; i++) {
    if (typeof proximitySearch === 'object') {
      tripRequests[i].checked = false;
      if (proximitySearch.includes('Origin') && checkIfInsideBoundingBox(tripRequests[i], trLat, trLon, blLat, blLon, 'Origin')) {
        // eslint-disable-next-line max-len
        tripRequests[i].totalDistance = calculateDistance(geoCodeData.lat, geoCodeData.lon, tripRequests[i].pLat, tripRequests[i].pLon);
        filteredTripRequests.push(tripRequests[i]);
        tripRequests[i].checked = true;
      } else if (proximitySearch.includes('Destination') && checkIfInsideBoundingBox(tripRequests[i], trLat, trLon, blLat, blLon, 'Destination')) {
        if (!tripRequests[i].checked) {
          // eslint-disable-next-line max-len
          tripRequests[i].totalDistance = calculateDistance(geoCodeData.lat, geoCodeData.lon, tripRequests[i].pLat, tripRequests[i].pLon);
          filteredTripRequests.push(tripRequests[i]);
        } 
      } 
    } else if (proximitySearch === 'Origin' && checkIfInsideBoundingBox(tripRequests[i], trLat, trLon, blLat, blLon, "Origin")) {
      // eslint-disable-next-line max-len
      tripRequests[i].totalDistance = calculateDistance(geoCodeData.lat, geoCodeData.lon, tripRequests[i].pLat, tripRequests[i].pLon);
      filteredTripRequests.push(tripRequests[i]);
    } else if (proximitySearch === 'Destination' && checkIfInsideBoundingBox(tripRequests[i], trLat, trLon, blLat, blLon, "Destination")) {
      // eslint-disable-next-line max-len
      tripRequests[i].totalDistance = calculateDistance(geoCodeData.lat, geoCodeData.lon, tripRequests[i].pLat, tripRequests[i].pLon);
      filteredTripRequests.push(tripRequests[i]);
    } 
  }

  return filteredTripRequests;
}

exports.index = function tripRequestsController(req, res) {
  res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display Trip Request create form on GET.
exports.tripRequest_create_get = function tripRequestsController(req, res, next) {
  const permission = accessControlService.checkCreateAllAccess(req.signedCookies.token.officer_role, 'tripRequests');
  if (permission.granted) {
    req.database.OfficerModel.findAll({ where: { active: true } }).then((officers) => {
      req.database.SettingModel.findByPk(1).then((settingsRecord) => {
        res.render('tripRequestCreate', { 
          title: 'Create New Trip Request', 
          officers, 
          clientId: req.query.clientId, 
          geocoderEndpoint: settingsRecord.geocoderEndpoint,
          otpEndpoint: settingsRecord.otpEndpoint,
        });
      })
    });
  } else {
    res.status(403).end();
  }
};

// Handle Trip Request create on POST.
exports.tripRequest_create_post = function tripRequestsController(req, res) {
  const permission = accessControlService.checkCreateAllAccess(req.signedCookies.token.officer_role, 'tripRequests');
  if (permission.granted) {
    if (req.query.clientId) {
      req.database.ClientProfileModel.findOne({ where: { clientId: req.query.clientId } })
        .then((clientSearchResult) => {
          const attributes = buildAttributes(clientSearchResult.id, req.body);
          req.database.TripRequestModel.create(attributes)
            .then((checkRecord) => {
              if (checkRecord) {
                res.render('tripRequestCreate', { s_status: 'Record saved' });
              } else {
                res.render('tripRequestCreate', { s_status: 'Record not created Error' });
              }
            });
        });
    } else { res.render('tripRequestCreate', { s_status: 'Record not created Error' }); }
  } else {
    res.status(403).end();
  }
};

// Display Trip Request delete form on GET.
exports.tripRequest_delete_get = function tripRequestsController(req, res) {
  const permission = accessControlService.checkDeleteAllAccess(req.signedCookies.token.officer_role, 'tripRequests');
  if (permission.granted) {
    if (req.params.id) {
      Promise.all([promiseTripRequest(req),
        promiseDesktopReview(req),
        promiseFieldReview(req),
        promiseADAPathway(req),
      ]).then((values) => {
        res.render('tripRequestDelete', {
          title: 'Delete/Restore Record',
          tripRequestSearchResult: values[0],
          tripRequestSearchResultCount: values[0].length,
          desktopReviewSearchResult: values[1],
          desktopReviewSearchResultCount: values[1].length,
          fieldReviewSearchResult: values[2],
          fieldReviewSearchResultCount: values[2].length,
          ADAPathwaySearchResult: values[3],
          ADAPathwaySearchResultCount: values[3].length,
        });
      });
    } else { res.render('tripRequestDelete', { title: 'Delete/Restore Record' }); }
  } else {
    res.status(403).end();
  }
};

// Handle Trip Request delete on POST.
exports.tripRequest_delete_post = function tripRequestsController(req, res) {
  const permission = accessControlService.checkDeleteAllAccess(req.signedCookies.token.officer_role, 'tripRequests');
  if (permission.granted) {
    let permanentDelete;
    let resultMessage;
    if (req.body.permanentDelete === 'true') {
      permanentDelete = true;
    } else { permanentDelete = false; }
    req.database.TripRequestModel.findOne({
      paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
      where: { id: req.params.id },
    }).then((tripRequestSearchResult) => {
      // To check this is Paranoid/soft Delete
      if (tripRequestSearchResult.deletedAt === null) {
        req.database.TripRequestModel.destroy({
          force: permanentDelete,
          where: { id: req.params.id },
        })
          .then((status) => {
            if ((status === 1) && (permanentDelete)) {
              resultMessage = 'Record Permanently Deleted !';
            } else if ((status === 1) && (!permanentDelete)) {
              resultMessage = 'Record Deleted !';
            } else { resultMessage = 'Error Processing Record'; }
            res.render('tripRequestDelete', { s_status: resultMessage });
          });
      } else {
        req.database.TripRequestModel.restore({
          force: req.body.permanentDelete,
          where: { id: req.params.id },
        })
          .then((status) => {
            if (status === 1) {
              resultMessage = 'Record Restored';
            } else { resultMessage = 'Error Processing Record'; }
            res.render('tripRequestDelete', { s_status: resultMessage });
          });
      }
    });
  } else {
    res.status(403).end();
  }
};

// Display Trip Request update form on GET.
exports.tripRequest_update_get = function tripRequestsController(req, res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'tripRequests');
  if (permission.granted) {
    if (req.query.id) {
      req.database.TripRequestModel.findAll({
        where: { id: req.query.id },
        include: [{ model: req.database.ClientProfileModel }, { model: req.database.OfficerModel }],
      })
        .then((tripRequestSearchResult) => {
          const searchResultCount = tripRequestSearchResult.length;
          req.database.OfficerModel.findAll({ where: { active: true } }).then((officers) => {
            req.database.SettingModel.findByPk(1).then((settingsRecord) => {
              res.render('tripRequestUpdate', {
                title: 'Update Record',
                search_result_count: searchResultCount,
                tripRequestSearchResult,
                officers,
                geocoderEndpoint: settingsRecord.geocoderEndpoint,
                otpEndpoint: settingsRecord.otpEndpoint,
              });
            });
          });
        });
    } else { res.render('tripRequestUpdate', { title: 'Update Record' }); }
  } else {
    res.status(403).end();
  }
};

// Handle Trip Request update on POST.
exports.tripRequest_update_post = function tripRequestsController(req, res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'tripRequests');
  if (permission.granted) {
    req.database.ClientProfileModel.findOne({ where: { clientId: req.body.clientsId } })
      .then((clientSearchResult) => {
        const attributes = buildAttributes(clientSearchResult.id, req.body);
        req.database.TripRequestModel.update(attributes,
          { returning: true, where: { id: req.body.id } })
          .then(([rowsUpdate, [updatedRecord]]) => {
            if (rowsUpdate === 1) {
              res.render('tripRequestUpdate', {
                s_status: 'Record updated',
                s_detail: updatedRecord,
              });
            } else {
              res.render('tripRequestUpdate', { s_status: 'Error updating record' });
            }
          });
      });
  } else {
    res.status(403).end();
  }
};

exports.tripRequest_update_geocode = function tripRequestsController(req, res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'tripRequests');
  if (permission.granted) {
    req.database.ClientProfileModel.findOne({ where: { clientId: req.body.clientsId } })
      .then((clientSearchResult) => {
        const attributes = buildAttributes(clientSearchResult.id, req.body);
        req.database.TripRequestModel.update(attributes,
          { returning: true, where: { id: req.body.id } })
          .then(([rowsUpdate]) => {
            if (rowsUpdate === 1) {
              res.send({ update_status: 'Record Updated'});
            } else {
              res.send({ update_status: 'Error updating record' });
            }
          });
      });
  } else {
    res.status(403).end();
  }
};

exports.tripRequest_clone_post = function tripRequestsController(req,res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'tripRequests');
  let attributes;
  if (permission.granted) {
    if (req.body.clientsId) {
      attributes = buildAttributes(req.body.clientsId, req.body);
      attributes.notes = `Cloned from Trip Id - ${req.body.id} and Client Id - ${req.body.clientsId}`;
      attributes.officersId = req.body.OfficerModel.id;
      attributes.bookingId = null;
      req.database.TripRequestModel.create(attributes).then((checkRecord) => {
        if (checkRecord) {
           res.send({ clone_status: 'Record cloned' });
        } else {
        res.send({ clone_status: 'Record not cloned Error' });
        }
      }).catch(e => res.send({ clone_status: 'Record not cloned Error' }));
        
    } else { 
      res.send({ clone_status: 'Record not cloned Error' });
    }
  } else {
    res.status(403).end();
  }
}

// Display list Trip Requestbased on default filter values.
exports.tripRequests_list = function tripRequestsController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'tripRequests');
  if (permission.granted) {
    const tripsDefaultFilter = 3;
    const daysDefaultFilter = 90;
    const filterdate = moment().subtract(daysDefaultFilter, 'days').format('YYYY-MM-DD');
    req.database.TripRequestModel.findAll({
      where: {
        [Op.and]: [
          { trips: { [Op.gte]: tripsDefaultFilter } },
          { DateAdded: { [Op.gte]: filterdate } },
        ],
      },
      paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
      include: [
        { model: req.database.ClientProfileModel },
        { model: req.database.OfficerModel },
        { model: req.database.DesktopReviewModel },
        { model: req.database.ADAPathwayModel },
      ],
      order: [
        ['updatedAt', 'DESC'],
      ],
    }).then((tripRequests) => {
      req.database.LookupCodes.findAll({}).then((lookupCodes) => {
        req.database.SettingModel.findByPk(1).then((settingsRecord) => {
          req.database.FieldReviewModel.findAll({}).then((fieldReviewSearchResult) => {
            req.database.ADAPathwayModel.findAll({
              paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
              include: [{
                model: req.database.TripRequestModel,
                include: [
                  { model: req.database.ClientProfileModel },
                  { model: req.database.OfficerModel },
                ], // Join ADAPathways with TripRequests and Clients and Officers
              }],
            }).then((ADAPathwayRecords) => {
              res.render('tripRequests', {
                tripRequests,
                lookupCodes,
                getLoggedUserRole: req.signedCookies.token.officer_role,
                tripsValue: tripsDefaultFilter,
                daysValue: daysDefaultFilter,
                fieldReviewSearchResult,
                ADAPathwayRecords,
                settingsRecord,
                historicPicMetaDataLayersSeattle:
                KCMTenant.loadHistoricalPicturesMetaDataSeattle(
                  req.subdomains[process.env.SUBDOMAIN_ARRAY_INDEX],
                ),
              });
            }); 
          });
        });
      });
    });
  } else {
    res.status(403).end();
  }
};

// Display list Trip Request based on the selected filter values.
exports.tripRequests_list_post = function tripRequestsController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'tripRequests');

  const distanceInKMeters = (parseFloat(req.body.proximityDistance) / 2) * 1.60934;
  const geoCodeData = { lat: req.body.addressLat, lon: req.body.addressLon };
  const [trLat, trLon, blLat, blLon] = createBoundingBox(distanceInKMeters, geoCodeData);
  const { proximitySearch } = req.body;
  let filteredTripRequests = [];
  let sortedArray;
  let totalDistance;
  let filterdate;
  let trips; 
  let dateAdded;
  let checkAll;

  if (typeof proximitySearch == 'object') {
    if (proximitySearch.includes('All records')) {
      checkAll = true;
    }
  }

  if (permission.granted) {
    if(checkAll) {
      trips = 0;
      filterdate = moment().format('YYYY-MM-DD');
      dateAdded = { [Op.lte]: filterdate }
    } else {
      trips = req.body.trips
      filterdate = moment().subtract(req.body.days, 'days').format('YYYY-MM-DD');
      dateAdded = { [Op.gte]: filterdate }
    }

    Promise.all([
      promiseTripRequestsAll(req, trips, dateAdded),
      promiseLookupCodes(req),
      promiseSettingsModel(req),
      promiseFieldReviewModelAll(req),
      promiseADAPathwayAll(req),
    ]).then((values) => {

        filteredTripRequests = getFilteredTripRequests(values[0], geoCodeData, proximitySearch, trLat, trLon, blLat, blLon);
        sortedArray = filteredTripRequests.sort((a,b) => a.totalDistance - b.totalDistance);
        
        res.render('tripRequests', {
          address: req.body.proximityAddress,
          distance: req.body.proximityDistance,
          tripRequests: sortedArray.length > 0 ? sortedArray : values[0],
          lookupCodes: values[1],
          getLoggedUserRole: req.signedCookies.token.officer_role,
          tripsValue: req.body.trips,
          daysValue: req.body.days,
          fieldReviewSearchResult: values[3],
          ADAPathwayRecords: values[4],
          settingsRecord: values[2],
          historicPicMetaDataLayersSeattle:
          KCMTenant.loadHistoricalPicturesMetaDataSeattle(
            req.subdomains[process.env.SUBDOMAIN_ARRAY_INDEX],
          ),
        });
      });
    
  } else {
    res.status(403).end();
  }
};

// Display detail page for a specific Trip Request.
exports.tripRequest_detail = function tripRequestsController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'tripRequests');
  if (permission.granted) {
    res.send(`NOT IMPLEMENTED: Client parameter passed after route (:id or /): ${req.params.id}`);
  } else {
    res.status(403).end();
  }
};
