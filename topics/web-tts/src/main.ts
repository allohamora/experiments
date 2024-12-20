import { SpeechManager } from "./speech-manager";
import { VoiceManager } from "./voice-manager";

const startButton = document.querySelector('.start-button');
const stopButton = document.querySelector('.stop-button');

const messages = document.querySelector('.messages');

const addMessage = (message: string) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messages?.appendChild(messageElement);
};

const voiceManager = new VoiceManager();
const speechManager = new SpeechManager();

speechManager.onRecognition((transcript) => {
  addMessage(transcript);
  voiceManager.voice(transcript);
});

startButton?.addEventListener('click', () => {
  console.log('start clicked');

  speechManager.startRecognition();
});

stopButton?.addEventListener('click', () => {
  console.log('stop clicked');

  speechManager.stopRecognition();
});