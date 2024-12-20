const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const startButton = document.querySelector('.start-button');
const stopButton = document.querySelector('.stop-button');

const recognition = new SpeechRecognition();
recognition.continuous = true;

const recognitionAbort = new AbortController();
const stopRecognition = () => {
  recognitionAbort.abort();
  recognition.stop();
};

const messages = document.querySelector('.messages');

const addMessage = (message: string) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messages?.appendChild(messageElement);
};

recognition.addEventListener('result', (event) => {
  console.log('result triggered', event);

  const { transcript } = event.results.item(event.results.length - 1).item(0);

  addMessage(transcript);
});

recognition.addEventListener('end', (event) => {
  console.log('end triggered', event);

  recognition.start();
}, { signal: recognitionAbort.signal });

startButton?.addEventListener('click', () => {
  console.log('start clicked');

  recognition.start();
});

stopButton?.addEventListener('click', () => {
  console.log('stop clicked');

  stopRecognition();
});