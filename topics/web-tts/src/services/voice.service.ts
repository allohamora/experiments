import { querySelector } from "../utils/dom.utils";

export class VoiceService {
  private voices: SpeechSynthesisVoice[] = [];
  private usVoices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;

  private voiceSelector = querySelector<HTMLSelectElement>('.voice-selector');

  constructor() {
    this.setVoices();
  }

  private async getVoices(): Promise<SpeechSynthesisVoice[]> {
    const voices = window.speechSynthesis.getVoices();

    if (voices.length) {
      return voices;
    }

    await new Promise(res => setTimeout(res, 5));

    return this.getVoices();
  }

  private setUsVoices() {
    for (let i = 0; i < this.usVoices.length; i++) {
      const usVoice = this.usVoices[i];

      const option = document.createElement('option');
      option.value = i.toString();
      option.textContent = usVoice.name;
  
      this.voiceSelector.appendChild(option);
    }

    this.voiceSelector.addEventListener('change', (event) => {
      const selectedIndex = parseInt((event.target as HTMLSelectElement).value);
      
      this.selectedVoice = this.usVoices[selectedIndex];
    });

    this.voiceSelector.disabled = false;
  };

  private async setVoices() {
    this.voices = await this.getVoices();
    this.usVoices = this.voices.filter(voice => voice.lang.includes('en-US'));
    this.setUsVoices();
  }

  public voice(message: string) {
    const event = new SpeechSynthesisUtterance(message);
    if (this.selectedVoice) {
      event.voice = this.selectedVoice;
    }

    window.speechSynthesis.speak(event);
  }
}