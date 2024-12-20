import { querySelector } from "../utils/dom.utils";

export class ControlService {
  private startButton = querySelector<HTMLButtonElement>('.start-button');
  private stopButton = querySelector<HTMLButtonElement>('.stop-button');

  public onStartClick(callback: () => void) {
    this.startButton.addEventListener('click', () => {
      console.log('start clicked');

      this.startButton.disabled = true;
      this.stopButton.disabled = false;

      callback();
    });
  }

  public onStopClick(callback: () => void) {
    this.stopButton.addEventListener('click', () => {
      console.log('stop clicked');

      this.startButton.disabled = false;
      this.stopButton.disabled = true;

      callback();
    });
  }
}