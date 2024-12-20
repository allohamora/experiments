import { querySelector } from "../utils/dom.utils";

export class HistoryService {
  private history = querySelector<HTMLDivElement>('.history');

  public addTranscript(transcript: string) {
    const transcriptElement = document.createElement('div');
    transcriptElement.textContent = transcript;

    this.history.appendChild(transcriptElement);
  }
}