const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export class SpeechService {
  private recognition = new SpeechRecognition();
  private abort = new AbortController();

  constructor() {
    this.recognition.continuous = true;
    this.recognition.lang = 'en-US';
  }

  public startRecognition() {
    this.recognition.start();

    this.recognition.addEventListener(
      'end',
      (event) => {
        console.log('end triggered', event);

        this.recognition.start();
      },
      { signal: this.abort.signal },
    );
  }

  public stopRecognition() {
    this.abort.abort();
    this.recognition.stop();
  }

  public onRecognition(listener: (transcript: string) => void) {
    this.recognition.addEventListener(
      'result',
      (event) => {
        const { transcript } = event.results.item(event.results.length - 1).item(0);

        console.log(event);

        listener(transcript);
      },
      { signal: this.abort.signal },
    );
  }
}
