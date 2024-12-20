import { ControlService } from "./services/control.service";
import { SpeechService } from "./services/speech.service";
import { VoiceService } from "./services/voice.service";
import { querySelector } from "./utils/dom.utils";

const messages = querySelector<HTMLDivElement>('.messages');

const addMessage = (message: string) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messages.appendChild(messageElement);
};

const controlService = new ControlService();
const voiceService = new VoiceService();
const speechService = new SpeechService();

speechService.onRecognition((transcript) => {
  addMessage(transcript);
  voiceService.voice(transcript);
});

controlService.onStartClick(() => {
  speechService.startRecognition();
});

controlService.onStopClick(() => {
  speechService.stopRecognition();
});
