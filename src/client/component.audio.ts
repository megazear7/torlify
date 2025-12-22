import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { pauseIcon, playIcon } from "./icons.js";

@customElement("inklify-audio")
export class InklifyAudio extends LitElement {
  static override styles = [
    globalStyles,
    css`
      :host {
        margin-bottom: var(--size-medium);
        display: block;
      }
      .audio-controls {
        display: flex;
        align-items: center;
        gap: var(--size-medium);
        padding: var(--size-medium);
        background: var(--color-secondary-surface);
        border-radius: var(--radius-medium);
      }
      .play-button {
        font-size: var(--font-medium);
        padding: var(--size-small) var(--size-medium);
        cursor: pointer;
        background: var(--color-1);
        color: var(--color-secondary-text);
        border: none;
        border-radius: var(--size-nano);
        transition: var(--transition-all);
      }
      .play-button:hover {
        background: var(--color-accent);
      }
      .progress-bar {
        flex: 1;
        height: var(--size-small);
        background: var(--color-secondary-bold);
        border-radius: var(--size-nano);
        overflow: hidden;
      }
      .progress-fill {
        height: 100%;
        background: var(--color-1);
        transition: width 0.1s ease;
      }
      .time-display {
        font-family: monospace;
        font-size: var(--font-small);
        min-width: 80px;
        text-align: center;
        color: var(--color-primary-text);
      }
    `,
  ];

  @property({ type: String })
  src: string = "";

  @property({ type: Boolean })
  isPlaying: boolean = false;

  @property({ type: Number })
  currentTime: number = 0;

  @property({ type: Number })
  duration: number = 0;

  private get audioElement(): HTMLAudioElement | null {
    return this.shadowRoot?.querySelector("#part-audio") as HTMLAudioElement;
  }

  override render(): TemplateResult {
    const progressPercent = this.duration ? (this.currentTime / this.duration) * 100 : 0;
    return html`
      <div class="audio-controls">
        <button class="play-button" @click=${this.togglePlay}>${this.isPlaying ? pauseIcon : playIcon}</button>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>
        <span class="time-display">${this.formatTime(this.currentTime)} / ${this.formatTime(this.duration)}</span>
      </div>
      <audio
        id="part-audio"
        src="${this.src}"
        preload="metadata"
        @timeupdate=${this.updateTime}
        @loadedmetadata=${this.updateDuration}
        @ended=${this.onEnded}
        @play=${this.setIsPlaying(true)}
        @pause=${this.setIsPlaying(false)}>
        Your browser does not support the audio element.
      </audio>
    `;
  }

  setIsPlaying(val: boolean): () => void {
    return () => {
      this.isPlaying = val;
    };
  }

  private async togglePlay(): Promise<void> {
    const audio = this.audioElement;
    if (!audio) return;

    try {
      if (this.isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (error) {
      console.error("Error toggling play:", error);
    }
  }

  private updateTime(): void {
    const audio = this.audioElement;
    if (audio) {
      this.currentTime = audio.currentTime;
    }
  }

  private updateDuration(): void {
    const audio = this.audioElement;
    if (audio) {
      this.duration = audio.duration;
    }
  }

  private onEnded(): void {
    this.isPlaying = false;
    this.currentTime = 0;
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
}
