import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";

@customElement("inklify-number-slider")
export class InklifyNumberSlider extends LitElement {
  static override styles = [
    globalStyles,
    css`
      .slider-container {
        margin-bottom: var(--size-large);
      }

      label {
        display: block;
        font-size: var(--font-medium);
        font-weight: 600;
        color: var(--color-primary-text);
        margin-bottom: var(--size-small);
      }

      .slider-wrapper {
        display: flex;
        align-items: center;
        gap: var(--size-medium);
      }

      input[type="range"] {
        flex: 1;
        -webkit-appearance: none;
        appearance: none;
        height: 6px;
        background: var(--color-primary-text-dark);
        border-radius: var(--radius-medium);
        outline: none;
        transition: var(--transition-all);
      }

      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background: var(--color-1);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: var(--shadow-normal);
        transition: var(--transition-all);
      }

      input[type="range"]::-webkit-slider-thumb:hover {
        background: var(--color-2);
        box-shadow: var(--shadow-hover);
        transform: scale(1.1);
      }

      input[type="range"]::-moz-range-thumb {
        width: 20px;
        height: 20px;
        background: var(--color-1);
        border-radius: 50%;
        cursor: pointer;
        border: none;
        box-shadow: var(--shadow-normal);
        transition: var(--transition-all);
      }

      input[type="range"]::-moz-range-thumb:hover {
        background: var(--color-2);
        box-shadow: var(--shadow-hover);
        transform: scale(1.1);
      }

      .value-display {
        font-size: var(--font-medium);
        font-weight: 600;
        color: var(--color-secondary-text);
        min-width: 30px;
        text-align: center;
      }
    `,
  ];

  @property({ type: Number })
  min = 1;

  @property({ type: Number })
  max = 100;

  @property({ type: Number })
  step = 1;

  @property({ type: String })
  label = "";

  @property({ type: Number })
  value = 1;

  override render(): TemplateResult {
    return html`
      <div class="slider-container">
        <label for="slider">${this.label}</label>
        <div class="slider-wrapper">
          <input
            id="slider"
            type="range"
            min=${this.min}
            max=${this.max}
            step=${this.step}
            .value=${this.value.toString()}
            @input=${this.handleInput} />
          <span class="value-display">${this.value}</span>
        </div>
      </div>
    `;
  }

  private readonly handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.value = Number(target.value);
    this.dispatchEvent(new CustomEvent("input", { detail: { value: this.value } }));
  };
}
