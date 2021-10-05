const fs = require('fs');

const loggedTenant = process.env.HISTORIC_PICTURE_TENANT_NAME; // Change "sea" to the actual tenant name or sub-domain name of tenant!

exports.loadHistoricalPicturesMetaDataSeattle =
    function loadHistoricalPicturesMetaDataSeattle(tenant) {
      const historicPicFolderPathSeattle = './public/images/historicPictures/';
      const historicPicMetaDataFileName = 'all_layer_pic_metadata.json';
      let historicPicLayerMetaData;
      if (tenant === loggedTenant) {
        historicPicLayerMetaData = JSON.parse(
          fs.readFileSync(historicPicFolderPathSeattle + historicPicMetaDataFileName),
        );
      } else {
        historicPicLayerMetaData = [];
      }
      return historicPicLayerMetaData;
    };
