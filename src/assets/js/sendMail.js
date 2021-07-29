export default function sendMail(messageObject) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(messageObject);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(
    'https://b67gdnjp7l.execute-api.eu-west-3.amazonaws.com/prod',
    requestOptions
  );
}
