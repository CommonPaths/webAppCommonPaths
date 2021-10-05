/* eslint-disable */
function triggerOTPGraph(user, lambdaFunctionName) {

  const getConfirmation = confirm(`Are you sure you want to Update OTP Graph?`);

  if(getConfirmation == true) {
    let domain = new URL(location.href);
    let subDomain = domain.hostname.split('.')[0];
    let keyname;

    if (subDomain == 'sea' || subDomain == 'kcm') {
      keyname = 'kcm';
    } else {
      keyname = subDomain;
    }
    
    const payload = {
      tenent: keyname, 
      username: user,
    };

    AWS.config.region = $('#cognitoRegion').val();
    const accessKeyId = $('#s3AccessKeyId').val();
    const secretAccessKey = $('#s3SecretAccessKey').val();

    AWS.config.update({
      accessKeyId,
      secretAccessKey,
      httpOptions: {
        timeout: 10 * 60 * 1000,
        connectTimeout: 10 * 60 * 1000,
      },
    });

    const lambda = new AWS.Lambda();
    var params = {
      FunctionName: lambdaFunctionName,
      Payload: JSON.stringify(payload),
    };

    const htmlAlert = `<div class="alert alert-success alert-dismissable fade show" role='alert'>
                        <div class="popupalerts" style="height:75px">
                          <button class="close" type='button' data-dismiss='alert'>
                            <span aria-hidden='true'> &times </span>
                          </button>
                        <h4 class="alert-heading">Update Process started</h2>
                        </div>
                      </div>`;

    $('#triggerAlert').html(htmlAlert);

    setTimeout(function() {
      window.location.reload()
    }, 1500)

    document.getElementById('updateOtpButton').disabled = true;
    document.getElementById('updateOtpButton').style.background = 'grey';

    lambda.invoke(params, function (err, data) {
      if (err) {
        window.alert('Error Occured Updating OTP graph')
      }
      else {
        window.alert('Success, OTP graph updated');
      }
    });
  }
}


function getLastUpdated() {
  AWS.config.region = $('#cognitoRegion').val();

  const accessKeyId = $('#s3AccessKeyId').val();
  const secretAccessKey = $('#s3SecretAccessKey').val();
  const bucketName = $('#s3BucketName').val();


  AWS.config.update({
    accessKeyId,
    secretAccessKey,
  });

  let domain = new URL(location.href);
  let subDomain = domain.hostname.split('.')[0];

  let keyname;

  if (subDomain == 'sea' || subDomain == 'kcm') {
    keyname = 'kcm';
  } else {
    keyname = subDomain;
  }

  const params = {
    Bucket: bucketName,
    Key: `${keyname}/status.json`,
    ResponseCacheControl: 'no-cache, no-store, must-revalidate'
  };

  const s3 = new AWS.S3();
  
  s3.getObject(params, function (err, data) {
    
    const jsonData = JSON.parse(String.fromCharCode.apply(null, data.Body));
    const domLastUpdated = document.getElementById('otplastupdated');
    domLastUpdated.append(` ${jsonData.last_updated}`);

    document.getElementById('last-updated').innerHTML = jsonData.last_updated;
    document.getElementById('updated-by').innerHTML = jsonData.username;
    document.getElementById('update-status').innerHTML = jsonData.status;

    if (jsonData.status == 'executing') {
      document.getElementById('updateOtpButton').disabled = true;
      document.getElementById('updateOtpButton').style.background = 'grey';
    }
  });
}
