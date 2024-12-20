import { ControlService } from "./services/control.service";
import { HistoryService } from "./services/history.service";
import { SpeechService } from "./services/speech.service";
import { VoiceService } from "./services/voice.service";

const controlService = new ControlService();
const voiceService = new VoiceService();
const speechService = new SpeechService();
const historyService = new HistoryService();

speechService.onRecognition((transcript) => {
  historyService.addTranscript(transcript);
  voiceService.voice(transcript);
});

controlService.onStartClick(() => {
  speechService.startRecognition();
});

controlService.onStopClick(() => {
  speechService.stopRecognition();
});
