import { log } from "./log.decorator.js";

export class Test {
  @log()
  public tick() {
    console.log('tick');
  }
}