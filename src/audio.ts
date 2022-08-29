export class GameAudio {
  private audioPath: string;
  private _audioElement: HTMLAudioElement;

  public get audioElement(): HTMLAudioElement {
    if (!this._audioElement) {
      this._audioElement = new Audio(this.audioPath);
    }

    return this._audioElement;
  }

  constructor(audioPath: string) {
    this.audioPath = audioPath;
  }

  public playOnce() {
    this.audioElement.loop = false;
    this.audioElement.play();
  }

  public playInLoop() {
    this.audioElement.loop = true;
    this.audioElement.play();
  }

  public pause() {
    this.audioElement.pause();
  }
}

export class EntityAudio {
  private readonly _walkOnGrassPath = '../grass_walk.mp3';
  
  public readonly WalkOnGrass: GameAudio = new GameAudio(this._walkOnGrassPath);
}
