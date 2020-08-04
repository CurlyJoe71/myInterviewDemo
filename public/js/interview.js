
//parameters for httprequest
const url = "/video/update";
const method = "POST";
const reqAsync = true;

//parsing the user's UID
const pathName = window.location.pathname;
console.log('pathName:', pathName);
const splitPath = pathName.split('/');
console.log('splitPath', splitPath);
const uid = splitPath[2]

// const testVideoID = 'd9f8536e-89db-46de-83fc-648dea3ce5e5';

let request = new XMLHttpRequest();

//Other settings for upcoming httprequest
request.onload = () => {
  let status = request.status;
  let dataRes = request.responseText;
  console.log('onload: ', dataRes);
}

request.open(method, url, reqAsync);

request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

//****TESTING**** */
const testingAPI = () => {
  console.log('starting testingAPI function');
  setTimeout(() => {
    console.log('time ran out');
    const data = `candUID=${uid}&testVideoID=${testVideoID}`;
    request.send(data);
  }, 3000);
}

//Will be called after user has completed video.
const callback = videoID => {
    console.log(`${videoID}`);
    alert(`About to make request.send with with this videoID: ${videoID}.`)
    const data = `candUID=${uid}&testVideoID=${videoID}`;
    request.send(data);
    window.setTimeout(myInterviewRecorder.reset, 1000)
}

// $(document).ready(testingAPI);

