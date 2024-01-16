console.log('client stript loaded');
const port = 8080;
console.log(`port: ${port}`);

interface ResponseData {
  message: string;
}

const chatDiv = document.getElementById('chatDiv');
const addNewQuestionField = () => {
  const inputField = document.createElement('textarea');
  inputField.setAttribute('placeholder', 'Enter your question here');
  inputField.className = 'inputField';
  chatDiv?.appendChild(inputField);
  window.scrollTo(0, document.body.scrollHeight);
  inputField.focus();
  const finishInput = () => {
    inputField.setAttribute('readonly', 'true');
    inputField.onchange = null;
    sendNewRequest(inputField.value);
  };
  inputField.onchange = () => finishInput();
  inputField.onkeypress = (e) => {
    if (e.keyCode === 13) {
      finishInput();
    }
  };
};
const addNewResponseFiled = (message: string) => {
  const responseFiled = document.createElement('textarea');
  responseFiled.innerHTML = message;
  responseFiled.setAttribute('readonly', 'true');
  responseFiled.className = 'responseField';
  chatDiv?.appendChild(responseFiled);
  window.scrollTo(0, document.body.scrollHeight);
  responseFiled.focus();
};

const xhr = new XMLHttpRequest();
xhr.addEventListener('load', (_event) => {
  if (xhr.status === 200) {
    const responseData = JSON.parse(xhr.responseText) as ResponseData;
    addNewResponseFiled(responseData.message);
  } else {
    addNewResponseFiled(`Error: ${xhr.statusText}`);
  }
  addNewQuestionField();
});
xhr.addEventListener('error', (event) => {
  console.error('Error sending request:', event);
});
const sendNewRequest = (message: string) => {
  const data = JSON.stringify({
    message,
  });
  xhr.open('POST', `http://localhost:${port}/test`, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(data);
};

addNewQuestionField();
