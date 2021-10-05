const AccessControl = require('accesscontrol');

const grantsObject = {
  admin: {
    clients: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    tripRequests: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    fieldReviews: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    officers: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    desktopReviews: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    pathways: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    reports: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    dataPipeline: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    settings: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  },

  supervisor: {
    clients: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      // 'delete:any': ['*'],
    },
    tripRequests: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      // 'delete:any': ['*'],
    },
    fieldReviews: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      // 'delete:any': ['*'],
    },
    officers: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      // 'delete:any': ['*'],
    },
    desktopReviews: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      // 'delete:any': ['*'],
    },
    pathways: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      // 'delete:any': ['*'],
    },
    reports: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      // 'delete:any': ['*'],
    },
    dataPipeline: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      // 'delete:any': ['*'],
    },
    settings: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      // 'delete:any': ['*'],
    },
  },

  reviewer: {
    clients: {
      // 'create:own': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      // 'delete:own': ['*'],
    },
    tripRequests: {
      // 'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      // 'delete:any': ['*'],
    },
    fieldReviews: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      // 'delete:any': ['*'],
    },
    officers: {
      // 'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      // 'delete:any': ['*'],
    },
    desktopReviews: {
      // 'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      // 'delete:any': ['*'],
    },
    pathways: {
      // 'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      // 'delete:any': ['*'],
    },
    reports: {
      // 'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      // 'delete:any': ['*'],
    },
    // dataPipeline: {
    //   // 'create:any': ['*'],
    //   // 'read:any': ['*'],
    //   // 'update:any': ['*'],
    //   // 'delete:any': ['*'],
    // },
    settings: {
      // 'create:any': ['*'],
      'read:any': ['*'],
      // 'update:any': ['*'],
      // 'delete:any': ['*'],
    },
  },

  agency: {
    // clients: {
    //   'create:own': ['*'],
    //   'read:own': ['*'],
    //   'update:own': ['*'],
    //   'delete:own': ['*'],
    // },
    pathways: {
      // 'create:any': ['*'],
      'read:any': ['*'],
      // 'update:any': ['*'],
      // 'delete:any': ['*'],
    },
    reports: {
      // 'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      // 'delete:any': ['*'],
    },
  },

  // sys_admin: {
  //   settings: {
  //     'create:any': ['*'],
  //     'read:any': ['*'],
  //     'update:any': ['*'],
  //     'delete:any': ['*'],
  //   },
  // },
};

const ac = new AccessControl(grantsObject);

const checkReadAllAccess = (role, accessRequest) => (ac.can(role).readAny(accessRequest));
const checkReadOwnAccess = (role, accessRequest) => (ac.can(role).readOwn(accessRequest));
const checkDeleteAllAccess = (role, accessRequest) => (ac.can(role).deleteAny(accessRequest));
const checkDeleteOwnAccess = (role, accessRequest) => (ac.can(role).deleteOwn(accessRequest));
const checkUpdateAllAccess = (role, accessRequest) => (ac.can(role).updateAny(accessRequest));
const checkUpdateOwnAccess = (role, accessRequest) => (ac.can(role).updateOwn(accessRequest));
const checkCreateAllAccess = (role, accessRequest) => (ac.can(role).createAny(accessRequest));
const checkCreateOwnAccess = (role, accessRequest) => (ac.can(role).createOwn(accessRequest));

exports.checkReadAllAccess = checkReadAllAccess;
exports.checkReadOwnAccess = checkReadOwnAccess;
exports.checkDeleteAllAccess = checkDeleteAllAccess;
exports.checkDeleteOwnAccess = checkDeleteOwnAccess;
exports.checkUpdateAllAccess = checkUpdateAllAccess;
exports.checkUpdateOwnAccess = checkUpdateOwnAccess;
exports.checkCreateAllAccess = checkCreateAllAccess;
exports.checkCreateOwnAccess = checkCreateOwnAccess;
