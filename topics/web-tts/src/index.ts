import { SpeechService } from "./services/speech.service";
import { VoiceService } from "./services/voice.service";

const startButton = document.querySelector('.start-button');
const stopButton = document.querySelector('.stop-button');

const messages = document.querySelector('.messages');

const addMessage = (message: string) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messages?.appendChild(messageElement);
};

const voiceService = new VoiceService();
const speechService = new SpeechService();

speechService.onRecognition((transcript) => {
  addMessage(transcript);
  voiceService.voice(transcript);
});

startButton?.addEventListener('click', () => {
  console.log('start clicked');

  speechService.startRecognition();
});

stopButton?.addEventListener('click', () => {
  console.log('stop clicked');

  speechService.stopRecognition();
});