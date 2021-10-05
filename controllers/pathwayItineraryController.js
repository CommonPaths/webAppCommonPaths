"use strict";

// const { NotAcceptable } = require('http-errors'); // TODO
// const { keys } = require('lodash');
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');
const { Op } = require('sequelize');
const moment = require('moment');
const accessControlService = require('../services/accessControlService');
const KCMTenant = require('../services/KCMTenant');

function showParanoidRecords(loggedUserRole) {
  if (loggedUserRole === 'admin') { return false; }
  return true;
}

function buildAttributes(reqId, reqTripRequestsId, reqOfficersId,
  reqPathwayData, reqNumItin, reqRouteInstruction, reqTripDurationTime) {
  const attributes = {
    id: reqId,
    pathwayItinerary: reqPathwayData,
    itineraryInstructionLegs: reqRouteInstruction,
    tripDurationTime: reqTripDurationTime,
    selectedItinNumber: reqNumItin,
    pathwayCompleteDate: null,
    priority: null,
    status: null,
    notes: null,
    tripRequestsId: reqTripRequestsId,
    officersId: reqOfficersId,
  };
  return attributes;
}

function determineBlockDistance({ conditions }) {
  if (conditions.includes('B1')) {
    return 330.0;
  } if (conditions.includes('B2')) {
    return 660.0;
  } if (conditions.includes('B3')) {
    return 990.0;
  } if (conditions.includes('BX')) {
    return 0.0;
  }
  return 990.0;
}

function timeSelector(tripRequestSearchResult) {
  if (tripRequestSearchResult[0].appointmentTime) {
    return [tripRequestSearchResult[0].appointmentTime, 'Appointment-Time'];
  }
  return [tripRequestSearchResult[0].tripTime, 'Trip-Time'];
}

function addWalkSteps(numberOfSteps) {
  let walkSteps = [];
  let stepElement = {
    absoluteDirection: '',
    barriers: '',
    distance: 0,
    isSlopeADACompliant: true,
    notes: '',
    relativeDirection: '',
    slope: '',
    streetName: ''
  };
  
  for (let i = 0; i < numberOfSteps; i++) {
    walkSteps.push(stepElement);
  }

  return walkSteps;
}

function addLegElement(mode, numberOfSteps) {
  let legElement = {};
  let walkLegElement = {
    from: '',
    mode: 'WALK',
    walkDistance: 0,
    steps: addWalkSteps(numberOfSteps),
    to: '' 
  };
  let busLegElement = {
    busNumber: '',
    busStopFrom: {
      barriers: '',
      bench: '',
      light: '',
      name: '',
      notes: '',
      shelter: '',
      stopTimeWeekdays: '',
      stopTimeSaturday: '',
      stopTimeSunday: ''
    },
    busStopTo: {
      barriers: '',
      bench: '',
      light: '',
      name: '',
      notes: '',
      shelter: '',
      stopTimeWeekdays: '',
      stopTimeSaturday: '',
      stopTimeSunday: ''
    },
    from: '',
    mode: 'BUS',
    to: '' 
  };

  if (mode == 'WALK') {
    legElement = walkLegElement;
  } else if (mode == 'BUS' || mode === 'TRAM') {
    legElement = busLegElement;
  } else {
    console.log('error composing Leg Element'); //ToDo Hsidelil convert to logger
  }

  return legElement;
}

function addORRemoveLeg(addRemoveLegParam, itineraryInstructionLegsUpdateParam, indexLeg, mode, numberOfSteps) {
  let itineraryInstructionLegsUpdate;

  if (addRemoveLegParam == 'ADD') {
    itineraryInstructionLegsUpdate = itineraryInstructionLegsUpdateParam;
    itineraryInstructionLegsUpdate.splice(indexLeg, 0, addLegElement(mode, numberOfSteps));
  } else if (addRemoveLegParam == 'REMOVE') {
    itineraryInstructionLegsUpdate = itineraryInstructionLegsUpdateParam.splice(indexLeg, 1);
  } else {
    console.log('error: invalid addRemoveLegParam'); // Todo: convert to logger Hsidelil
  }
  
  return itineraryInstructionLegsUpdate;
}

function findBusStopAmenityBarriers(pathwaysRecordParam, amenityType, barriersListParam) {
  if ((pathwaysRecordParam['busStopFrom'][amenityType] =='No') ||
      (pathwaysRecordParam['busStopTo'][amenityType] =='No'))
  {
    barriersListParam.push(amenityType + '_no');
  }

  return barriersListParam;
}

function findBusStopBarriers(pathwaysRecordParam, barriersListParam) {
  if (pathwaysRecordParam['busStopFrom']['barriers'] != '') {
    barriersListParam.push(pathwaysRecordParam['busStopFrom']['barriers']);
  }
  if (pathwaysRecordParam['busStopTo']['barriers'] !='') {
    barriersListParam.push(pathwaysRecordParam['busStopTo']['barriers']);
  }

  return barriersListParam;
}

function findWalkLegBarriers(pathwaysRecordParam, barriersListParam) {
  for (let k=0; k < pathwaysRecordParam['steps'].length; k++) {
    if (pathwaysRecordParam['steps'][k]['barriers'] != '') {
      barriersListParam.push(pathwaysRecordParam['steps'][k]['barriers']);
    }
  }

  return barriersListParam;
}

function barriersParser(pathwaysRecordFiltered) {
  let barriersList = [];
  let barriersSet;

  for (let i=0; i < pathwaysRecordFiltered.length; i++) {
    if (pathwaysRecordFiltered[i]['dataValues']['itineraryInstructionLegs']) {
      for (let j=0; j < pathwaysRecordFiltered[i]['dataValues']['itineraryInstructionLegs'].length; j++) {
        if (pathwaysRecordFiltered[i]['dataValues']['itineraryInstructionLegs'][j]['mode'] == 'WALK') {
          findWalkLegBarriers(pathwaysRecordFiltered[i]['dataValues']['itineraryInstructionLegs'][j], barriersList);
        } else if ((pathwaysRecordFiltered[i]['dataValues']['itineraryInstructionLegs'][j]['mode'] == 'BUS')) {
          barriersList = findBusStopBarriers(pathwaysRecordFiltered[i]['dataValues']['itineraryInstructionLegs'][j], barriersList);
          barriersList = findBusStopAmenityBarriers(pathwaysRecordFiltered[i]['dataValues']['itineraryInstructionLegs'][j], 'shelter', barriersList);
          barriersList = findBusStopAmenityBarriers(pathwaysRecordFiltered[i]['dataValues']['itineraryInstructionLegs'][j], 'bench', barriersList);
          barriersList = findBusStopAmenityBarriers(pathwaysRecordFiltered[i]['dataValues']['itineraryInstructionLegs'][j], 'light', barriersList);
        }
        barriersSet = new Set(barriersList);
      }
      pathwaysRecordFiltered[i]['barriers'] = (!barriersList.length ? [] : Array.from(barriersSet));
      barriersList = [];
    }
  }
  
  return pathwaysRecordFiltered;
}

exports.index = function pathwayItineraryController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'pathways');
  if (permission.granted) {
    res.send('NOT IMPLEMENTED: Site Page');
  } else {
    res.status(403).end();
  }
};

exports.pathwayItinerary_formulate_get = function pathwayItineraryController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'pathways');
  if (permission.granted) {
    if (req.query.tripRequestId) {
      req.database.TripRequestModel.findAll({
        where: { id: req.query.tripRequestId },
        include: [{ model: req.database.ClientProfileModel }, { model: req.database.OfficerModel }],
      }).then((tripRequestSearchResult) => {
        req.database.ADAPathwayModel.findAll({
          where: { tripRequestsId: req.query.tripRequestId },
        }).then((ADAPathwaySearchResult) => {
          req.database.FieldReviewModel.findAll({}).then((fieldReviewSearchResult) => {
            req.database.SettingModel.findByPk(1).then((settingsRecord) => {
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
                res.render('pathwayItinerary', {
                  search_result_count: ADAPathwaySearchResult.length,
                  tripRequestSearchResult,
                  ADAPathwayRecords,
                  ADAPathwaySearchResult,
                  blockDistance: determineBlockDistance(
                    tripRequestSearchResult[0].ClientProfileModel,
                  ),
                  timeSelector: timeSelector(tripRequestSearchResult),
                  settingsRecord,
                  fieldReviewSearchResult,
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
    } else { res.render('pathwayItinerary', { s_status: 'error' }); }
  } else {
    res.status(403).end();
  }
};

exports.pathwayItinerary_formulate_post = function pathwayItineraryController(req, res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'pathways');
  if (permission.granted) {
    if ((req.query.tripRequestId) && (req.body.pathwayData)) {
      req.database.TripRequestModel.findAll({
        where: { id: req.query.tripRequestId },
        include: [{ model: req.database.ClientProfileModel }, { model: req.database.OfficerModel }],
      }).then((tripRequestSearchResult) => {
        const attributes = buildAttributes(
          req.body.ADAPathwayId,
          req.query.tripRequestId,
          tripRequestSearchResult[0].OfficerModel.id,
          req.body.pathwayData,
          req.body.selectedItinNumber,
          JSON.parse(req.body.routeInstruction),
          req.body.tripDurationTime,
        );
        req.database.ADAPathwayModel.upsert(attributes).then((result) => {
          res.send({ s_status: 'Record Saved/Updated', result });
        });
      });
    } else { res.render('pathwayItinerary', { s_status: 'No Pathway to Save' }); }
  } else {
    res.status(403).end();
  }
};

// GET request to load and display saved pathway itinerary
exports.pathwayItinerary_update_get = function pathwayItineraryController(req, res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'pathways');
  if (permission.granted) {
    if (req.query.tripRequestId) {
      req.database.TripRequestModel.findAll({
        where: { id: req.query.tripRequestId },
        include: [{ model: req.database.ClientProfileModel }, { model: req.database.OfficerModel }],
      }).then((tripRequestSearchResult) => {
        req.database.ADAPathwayModel.findAll({
          where: { tripRequestsId: req.query.tripRequestId },
        }).then((ADAPathwaySearchResult) => {
          req.database.FieldReviewModel.findAll({}).then((fieldReviewSearchResult) => {
            req.database.SettingModel.findByPk(1).then((settingsRecord) => {
              req.database.ADAPathwayModel.findAll({
                paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
                include: [{
                  model: req.database.TripRequestModel,
                  include: [
                    { model: req.database.ClientProfileModel },
                    { model: req.database.OfficerModel },
                  ], // Join ADAPathways with TripRequests and Officers
                },
                { model: req.database.OfficerModel }],
              }).then((ADAPathwayRecords) => {
                res.render('pathwayItineraryUpdate', {
                  search_result_count: ADAPathwaySearchResult.length,
                  tripRequestSearchResult,
                  ADAPathwaySearchResult,
                  blockDistance: determineBlockDistance(
                    tripRequestSearchResult[0].ClientProfileModel,
                  ),
                  timeSelector: timeSelector(tripRequestSearchResult),
                  ADAPathwayRecords,
                  settingsRecord,
                  fieldReviewSearchResult,
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
    } else { res.render('pathwayItineraryUpdate', { s_status: 'error' }); }
  } else {
    res.status(403).end();
  }
};

// POST request to edit/save the loaded pathway transit instruction
exports.pathwayItinerary_update_post = function pathwayItineraryController(req, res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'pathways');
  if (permission.granted) {
    req.database.ADAPathwayModel.findOne({ where: { id: req.body.ADAPathwayRecordId } })
      .then((ADAPathwayRecord) => {
        const attributes = buildAttributes(
          ADAPathwayRecord.id,
          ADAPathwayRecord.tripRequestsId,
          ADAPathwayRecord.officersId,
          ADAPathwayRecord.pathwayItinerary,
          ADAPathwayRecord.selectedItinNumber,
          req.body.transitInstruction,
          req.body.tripDurationTime,
        );
        req.database.ADAPathwayModel.update(attributes,
          { returning: true, where: { id: ADAPathwayRecord.id } })
          .then(([rowsUpdate, [updatedRecord]]) => {
            if (rowsUpdate === 1) {
              res.send({ s_status: 'Record Saved/Updated', result: updatedRecord });
            } else {
              res.send({ s_status: 'Error in Saving/Updating Record', result: updatedRecord });
            }
          });
      });
  } else {
    res.status(403).end();
  }
};


// GET request to load and display saved pathway itinerary for agency users
exports.pathwayItinerary_view_get = function pathwayItineraryController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'pathways');
  if (permission.granted) {
    if (req.query.tripRequestId) {
      req.database.TripRequestModel.findAll({
        where: { id: req.query.tripRequestId },
        include: [{ model: req.database.ClientProfileModel }, { model: req.database.OfficerModel }],
      }).then((tripRequestSearchResult) => {
        req.database.ADAPathwayModel.findAll({
          where: { tripRequestsId: req.query.tripRequestId },
        }).then((ADAPathwaySearchResult) => {
          req.database.FieldReviewModel.findAll({}).then((fieldReviewSearchResult) => {
            req.database.SettingModel.findByPk(1).then((settingsRecord) => {
              req.database.ADAPathwayModel.findAll({
                paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
                include: [{
                  model: req.database.TripRequestModel,
                  include: [
                    { model: req.database.ClientProfileModel },
                    { model: req.database.OfficerModel },
                  ], // Join ADAPathways with TripRequests and Officers
                },
                { model: req.database.OfficerModel }],
              }).then((ADAPathwayRecords) => {
                res.render('pathwayItineraryView', {
                  search_result_count: ADAPathwaySearchResult.length,
                  tripRequestSearchResult,
                  ADAPathwaySearchResult,
                  blockDistance: determineBlockDistance(
                    tripRequestSearchResult[0].ClientProfileModel,
                  ),
                  timeSelector: timeSelector(tripRequestSearchResult),
                  ADAPathwayRecords,
                  settingsRecord,
                  fieldReviewSearchResult,
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
    } else { res.render('pathwayItineraryView', { s_status: 'error' }); }
  } else {
    res.status(403).end();
  }
};

// Display list of all pathways GET.
exports.pathways_list = function pathwayItineraryController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'pathways');
  const daysDefaultFilter = 90;
  const dateStart = moment().subtract(daysDefaultFilter, 'days').format('YYYY-MM-DD HH:mm:ss');
  const dateEnd = moment().format('YYYY-MM-DD HH:mm:ss'); 
  
  if (permission.granted) {
    req.database.ADAPathwayModel.findAll({
      paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
      include: [{
        model: req.database.TripRequestModel,
        include: [
          { model: req.database.ClientProfileModel },
          { model: req.database.OfficerModel },
        ], // Join ADAPathways with TripRequests and Clients and Officers
      },
      { model: req.database.OfficerModel }],
      order: [
        ['updatedAt', 'DESC'],
      ],
    }).then((pathwaylist) => {
      req.database.ADAPathwayModel.findAll({
        where: {
          [Op.and]: [
            { updatedAt: { [Op.gte]: dateStart } },
            { updatedAt: { [Op.lte]: dateEnd } },
          ],
        },
        paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
        include: [{
          model: req.database.TripRequestModel,
          include: [
            { model: req.database.ClientProfileModel },
            { model: req.database.OfficerModel },
          ], // Join ADAPathways with TripRequests and Clients and Officers
        },
        { model: req.database.OfficerModel }],
        order: [
          ['updatedAt', 'DESC'],
        ],
      }).then((pathwayRecordsFiltered) => {
        req.database.FieldReviewModel.findAll({}).then((fieldReviewSearchResult) => {
          req.database.SettingModel.findByPk(1).then((settingsRecord) => {
            res.render('pathways', {
              dateStart: dateStart.split(' ')[0],
              dateEnd: dateEnd.split(' ')[0],
              adapathwayList: pathwaylist,
              pathwaylistFiltered: barriersParser(pathwayRecordsFiltered),
              settingsRecord,
              getLoggedUserRole: req.signedCookies.token.officer_role,
              fieldReviewSearchResult,
              historicPicMetaDataLayersSeattle:
              KCMTenant.loadHistoricalPicturesMetaDataSeattle(
                req.subdomains[process.env.SUBDOMAIN_ARRAY_INDEX],
              ),
            });
          });
        });
      });
    });
  }
};

// Display list of all pathways POST.
exports.pathways_list_post = function pathwayItineraryController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'pathways');
  let dateStart = req.body.dateStart + ' ' + moment().format('HH:mm:ss');
  let dateEnd = req.body.dateEnd + ' ' +  moment().format('HH:mm:ss');

  if (permission.granted) {
    req.database.ADAPathwayModel.findAll({
      paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
      include: [{
        model: req.database.TripRequestModel,
        include: [
          { model: req.database.ClientProfileModel },
          { model: req.database.OfficerModel },
        ], // Join ADAPathways with TripRequests and Clients and Officers
      },
      { model: req.database.OfficerModel }],
      order: [
        ['updatedAt', 'DESC'],
      ],
    }).then((pathwaylist) => {
      req.database.ADAPathwayModel.findAll({
        where: {
          [Op.and]: [
            { updatedAt: { [Op.gte]: dateStart } },
            { updatedAt: { [Op.lte]: dateEnd } },
          ],
        },
        paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
        include: [{
          model: req.database.TripRequestModel,
          include: [
            { model: req.database.ClientProfileModel },
            { model: req.database.OfficerModel },
          ], // Join ADAPathways with TripRequests and Clients and Officers
        },
        { model: req.database.OfficerModel }],
        order: [
          ['updatedAt', 'DESC'],
        ],
      }).then((pathwaylistFiltered) => {
        req.database.FieldReviewModel.findAll({}).then((fieldReviewSearchResult) => {
          req.database.SettingModel.findByPk(1).then((settingsRecord) => {
            // barriersParser(pathwaylistFiltered);
            res.render('pathways', {
              dateStart: dateStart.split(' ')[0],
              dateEnd: dateEnd.split(' ')[0],
              adapathwayList: pathwaylist,
              pathwaylistFiltered: barriersParser(pathwaylistFiltered),
              settingsRecord,
              getLoggedUserRole: req.signedCookies.token.officer_role,
              fieldReviewSearchResult,
              historicPicMetaDataLayersSeattle:
              KCMTenant.loadHistoricalPicturesMetaDataSeattle(
                req.subdomains[process.env.SUBDOMAIN_ARRAY_INDEX],
              ),
            });
          });
        });
      });
    });
  }
};

// Display Pathway delete form on GET.
exports.pathwayItinerary_delete_get = function pathwayItineraryController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'pathways');
  if (permission.granted) {
    if (req.query.tripRequestId) {
      req.database.TripRequestModel.findAll({
        where: { id: req.query.tripRequestId },
        include: [{ model: req.database.ClientProfileModel }, { model: req.database.OfficerModel }],
      }).then((tripRequestSearchResult) => {
        req.database.ADAPathwayModel.findAll({
          paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
          where: { tripRequestsId: req.query.tripRequestId },
        }).then((ADAPathwaySearchResult) => {
          req.database.SettingModel.findByPk(1).then((settingsRecord) => {
            res.render('pathwayItineraryDelete', {
              search_result_count: ADAPathwaySearchResult.length,
              tripRequestSearchResult,
              ADAPathwaySearchResult,
              blockDistance: determineBlockDistance(tripRequestSearchResult[0].ClientProfileModel),
              timeSelector: timeSelector(tripRequestSearchResult),
              settingsRecord,
            });
          });
        });
      });
    } else { res.render('pathwayItineraryDelete', { s_status: 'error' }); }
  } else {
    res.status(403).end();
  }
};

// Handle Pathway Review delete on POST.
exports.pathwayItinerary_delete_post = function pathwayItineraryController(req, res) {
  const permission = accessControlService.checkDeleteAllAccess(req.signedCookies.token.officer_role, 'pathways');
  if (permission.granted) {
    let permanentDelete;
    let resultMessage;
    if (req.body.permanentDelete === 'true') {
      permanentDelete = true;
    } else { permanentDelete = false; }
    req.database.ADAPathwayModel.findOne({
      paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
      where: { id: req.params.id },
    }).then((ADAPathwaySearchResult) => {
      // To check this is Paranoid/soft Delete
      if (ADAPathwaySearchResult.deletedAt === null) {
        req.database.ADAPathwayModel.destroy({
          force: permanentDelete,
          where: { id: req.params.id },
        })
          .then((status) => {
            if ((status === 1) && (permanentDelete)) { resultMessage = 'Record Permanently Deleted !';
            } else if ((status === 1) && (!permanentDelete)) { resultMessage = 'Record Deleted !';
            } else { resultMessage = 'Error Processing Record'; }
            res.render('pathwayItineraryDelete', {
              s_status: resultMessage,
            });
          });
      } else {
        req.database.ADAPathwayModel.restore({
          force: req.body.permanentDelete,
          where: { id: req.params.id },
        })
          .then((status) => {
            if (status === 1) { resultMessage = 'Record Restored'; }
            else { resultMessage = 'Error Processing Record'; }
            res.render('pathwayItineraryDelete', {
              s_status: resultMessage,
            });
          });
      }
    });
  } else {
    res.status(403).end();
  }
};

exports.pathwayItinerary_add_get = function pathwayItineraryController(req, res) {
  const permission = accessControlService.checkDeleteAllAccess(req.signedCookies.token.officer_role, 'pathways');
  if (permission.granted) {
    res.send(`NOT IMPLEMENTED: ${req.params.id}`);
  } else {
    res.status(403).end();
  }
}

exports.pathwayItinerary_add_post = function pathwayItineraryController(req, res) {
  const permission = accessControlService.checkDeleteAllAccess(req.signedCookies.token.officer_role, 'pathways');
  let attributes;
  let itineraryInstructionLegsUpdate;

  if (permission.granted) {
    req.database.ADAPathwayModel.findAll({
      where: { tripRequestsId: req.body.tripRequestId },
      }).then((ADAPathwaySearchResult) => {

        itineraryInstructionLegsUpdate = ADAPathwaySearchResult[0].itineraryInstructionLegs;
        addORRemoveLeg(req.body.addRemoveLeg, itineraryInstructionLegsUpdate, req.body.indexLeg, req.body.mode, req.body.numberOfSteps);

        attributes = buildAttributes(
          ADAPathwaySearchResult[0].id, 
          ADAPathwaySearchResult[0].tripRequestsId, 
          ADAPathwaySearchResult[0].officersId,
          ADAPathwaySearchResult[0].pathwayItinerary, 
          ADAPathwaySearchResult[0].selectedItinNumber, 
          itineraryInstructionLegsUpdate,
          ADAPathwaySearchResult[0].tripDurationTime,
        );

        req.database.ADAPathwayModel.update(attributes,
          { returning: true, where: { id: ADAPathwaySearchResult[0].id } })
          .then(([rowsUpdate, [updatedRecord]]) => {
            if (rowsUpdate === 1) {
              res.send({ s_status: `Leg ${(req.body.addRemoveLeg).toLowerCase()} `, result: updatedRecord });
            } else {
              res.send({ s_status: 'Error in Adding/Removing Leg', result: updatedRecord });
            }
          });

      }
    );
  } else {
    res.status(403).end();
  }
}