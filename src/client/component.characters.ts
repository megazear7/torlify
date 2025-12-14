import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import { consume } from "@lit/context";
import { BookContext, bookContext } from "./context.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { dispatch } from "./util.events.js";
import { downArrowIcon, plusIcon, trashIcon, upArrowIcon } from "./icons.js";
import { wait } from "../shared/util.wait.js";
import { DebounceHandler } from "./util.debounce.js";
import { updateBookService } from "../shared/service.update-book.js";
import { SaveEvent } from "./event.save.js";
import "./component.auto-textarea.js";

@customElement("torlify-characters")
export class TorlifyCharacters extends LitElement {
  static override styles = [
    globalStyles,
    css`
      .characters-container {
        margin-top: var(--size-xl);
      }

      .characters-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--size-medium);
      }

      .add-button {
        background: var(--color-secondary-surface);
        color: var(--color-secondary-text);
        border: none;
        border-radius: var(--radius-medium);
        padding: var(--size-small) var(--size-medium);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--size-small);
        font-size: var(--font-small);
        transition: var(--transition-all);
      }

      .add-button:hover {
        background: var(--color-2);
        transform: var(--transform-hover);
      }

      .characters-list {
        display: flex;
        flex-direction: column;
        gap: var(--size-large);
      }

      .character-item {
        position: relative;
        background: var(--color-secondary-surface);
        border-radius: var(--radius-medium);
        padding: var(--size-medium);
        padding-top: calc(var(--size-xl) + 4px);
        display: flex;
        align-items: flex-start;
        gap: var(--size-medium);
        animation: slideIn 0.3s ease-out;
        border: 1px solid transparent;
        transition: var(--transition-all);
        box-shadow: var(--shadow-normal);
      }

      .character-item:hover {
        box-shadow: var(--shadow-hover);
      }

      .character-item.removing {
        animation: slideOut 0.3s ease-in forwards;
      }

      .character-inputs {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--size-large);
      }

      .character-field {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: var(--size-medium);
      }

      .character-label {
        position: absolute;
        top: calc((-1 * var(--size-large)) - 4px);
        font-size: var(--font-tiny);
        font-weight: 500;
        text-transform: uppercase;
        color: var(--color-secondary-text-muted);
      }

      .character-input {
        border: 1px solid var(--color-grey-transparent);
        border-radius: var(--radius-medium);
        background: transparent;
        padding: var(--size-medium) var(--size-large);
        color: var(--color-primary-text);
        font-size: var(--font-medium);
        transition: var(--transition-all);
      }

      .character-input:focus {
        outline: none;
        border-color: var(--color-1);
        box-shadow: var(--shadow-active);
        background: var(--color-secondary-surface-active);
      }

      .character-input::placeholder {
        color: var(--color-secondary-text);
        opacity: 0.7;
      }

      .remove-button {
        background: none;
        border: none;
        color: var(--color-primary-text);
        cursor: pointer;
        padding: var(--size-small);
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition-all);
        opacity: 0.7;
      }

      .remove-button:hover {
        background: var(--color-error);
        color: white;
        opacity: 1;
        transform: scale(1.1);
      }

      .empty-state {
        text-align: center;
        color: var(--color-secondary-text);
        font-style: italic;
        padding: var(--size-xl);
        background: var(--color-secondary-surface);
        border-radius: var(--radius-medium);
        border: 2px dashed var(--color-border);
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-10px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes slideOut {
        from {
          opacity: 1;
          transform: translateY(0) scale(1);
          max-height: 200px;
        }
        to {
          opacity: 0;
          transform: translateY(-10px) scale(0.95);
          max-height: 0;
          margin: 0;
          padding: 0;
        }
      }
    `,
  ];

  @consume({ context: bookContext, subscribe: true })
  @property({ attribute: false })
  public bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  @property({ type: Array })
  private removingIndices: number[] = [];

  private debounceHandler = new DebounceHandler();

  override render(): TemplateResult {
    const characters = this.bookContext.book?.characters || [];

    return html`
      <div class="characters-container">
        <div class="characters-header">
          <h4>Characters</h4>
          <button class="add-button" @click="${this.addCharacter}">${plusIcon} Add Character</button>
        </div>

        ${characters.length === 0
          ? html`
              <div class="empty-state">No characters added yet</div>
            `
          : html`
              <div class="characters-list">
                ${characters.map(
                  (character, index) => html`
                    <div class="character-item ${this.removingIndices.includes(index) ? "removing" : ""}">
                      <div class="character-inputs">
                        <div class="character-field">
                          <label class="character-label">Character Name</label>
                          <input
                            class="character-input"
                            type="text"
                            placeholder="Enter character name"
                            .value="${character.name}"
                            @input="${(e: Event): void =>
                              this.updateCharacter(index, "name", (e.target as HTMLInputElement).value)}" />
                        </div>
                        <div class="character-field">
                          <label class="character-label">Instructions</label>
                          <torlify-auto-textarea
                            .value="${character.instructions}"
                            @input="${(e: Event): void =>
                              this.updateCharacter(
                                index,
                                "instructions",
                                (e.target as HTMLTextAreaElement).value,
                              )}"></torlify-auto-textarea>
                        </div>
                      </div>
                      <button
                        class="remove-button"
                        @click="${async (): Promise<void> => this.removeCharacter(index)}"
                        title="Remove character">
                        ${trashIcon}
                      </button>
                      <button
                        class="move-up"
                        ?disabled=${index === 0}
                        @click=${this.moveUp(index)}
                        title="${index === 0 ? 'This is already the first character' : 'Move character up'}">
                        ${upArrowIcon}
                      </button>
                      <button
                        class="move-down"
                        ?disabled=${index === characters.length - 1}
                        @click=${this.moveDown(index)}
                        title="${index === characters.length - 1 ? 'This is already the last character' : 'Move character down'}">
                        ${downArrowIcon}
                      </button>
                    </div>
                  `,
                )}
              </div>
            `}
      </div>
    `;
  }

  private addCharacter(): void {
    const currentCharacters = this.bookContext.book?.characters || [];
    const newCharacters = [...currentCharacters, { name: "", instructions: "" }];
    this.bookContext.book = {
      ...this.bookContext.book!,
      characters: newCharacters,
    };
    this.requestUpdate();
    this.debounceHandler.debounce(() => {
      updateBookService.fetch({
        name: this.bookContext.book!.id,
        book: this.bookContext.book!,
      });
      dispatch(this, SaveEvent());
    });
  }

  private moveUp(index: number): () => void {
    return (): void => {
      if (index === 0) return;
      const currentCharacters = this.bookContext.book?.characters || [];
      const newCharacters = [...currentCharacters];
      [newCharacters[index - 1], newCharacters[index]] = [
        newCharacters[index],
        newCharacters[index - 1],
      ];
      this.bookContext.book = {
        ...this.bookContext.book!,
        characters: newCharacters,
      };
      this.requestUpdate();
      this.debounceHandler.debounce(() => {
        updateBookService.fetch({
          name: this.bookContext.book!.id,
          book: {
            characters: newCharacters,
          },
        });
        dispatch(this, SaveEvent());
      });
    };
  }

  private moveDown(index: number): () => void {
    return (): void => {
      const currentCharacters = this.bookContext.book?.characters || [];
      if (index === currentCharacters.length - 1) return;
      const newCharacters = [...currentCharacters];
      [newCharacters[index + 1], newCharacters[index]] = [
        newCharacters[index],
        newCharacters[index + 1],
      ];
      this.bookContext.book = {
        ...this.bookContext.book!,
        characters: newCharacters,
      };
      this.requestUpdate();
      this.debounceHandler.debounce(() => {
        updateBookService.fetch({
          name: this.bookContext.book!.id,
          book: {
            characters: newCharacters,
          }
        });
        dispatch(this, SaveEvent());
      });
    };
  }

  private async removeCharacter(index: number): Promise<void> {
    this.removingIndices = [...this.removingIndices, index];
    this.requestUpdate();
    await wait(350);
    this.removingIndices = this.removingIndices.filter((i) => i !== index);
    const currentCharacters = this.bookContext.book?.characters || [];
    const newCharacters = currentCharacters.filter((_, i) => i !== index);
    this.bookContext.book = {
      ...this.bookContext.book!,
      characters: newCharacters,
    };
    this.debounceHandler.debounce(() => {
      updateBookService.fetch({
        name: this.bookContext.book!.id,
        book: this.bookContext.book!,
      });
      dispatch(this, SaveEvent());
    });
  }

  private updateCharacter(index: number, field: "name" | "instructions", value: string): void {
    const currentCharacters = this.bookContext.book?.characters || [];
    const newCharacters = currentCharacters.map((character, i) =>
      i === index ? { ...character, [field]: value } : character,
    );
    this.bookContext.book = {
      ...this.bookContext.book!,
      characters: newCharacters,
    };
    this.debounceHandler.debounce(() => {
      updateBookService.fetch({
        name: this.bookContext.book!.id,
        book: this.bookContext.book!,
      });
      dispatch(this, SaveEvent());
    });
  }
}
