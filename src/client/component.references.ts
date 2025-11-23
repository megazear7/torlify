import { consume } from "@lit/context";
import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { BookContext, bookContext } from "./context.book.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { globalStyles } from "./styles.global.js";
import { ReferenceUse } from "../shared/type.book.js";
import { dispatch } from "./util.events.js";
import { UpdateBookEvent } from "./event.update-book.js";
import { buildNestedObject } from "../shared/util.property.js";
import { BookPartial } from "../shared/type.book.js";
import { plusIcon, trashIcon, editIcon } from "./icons.js";
import { TorlifyModal } from "./component.modal.js";
import { uploadReferenceService } from "../shared/service.upload-reference.js";
import { WarningEvent } from "./event.warning.js";

@customElement("torlify-references")
export class TorlifyReferences extends LitElement {
  static override styles = [
    globalStyles,
    css`
      .references-container {
        margin-top: var(--size-xl);
      }

      .references-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--size-medium);
      }

      .references-title {
        font-size: var(--font-medium);
        font-weight: 600;
        color: var(--color-primary-text);
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

      .references-list {
        display: flex;
        flex-direction: column;
        gap: var(--size-large);
      }

      .reference-item {
        background: var(--color-secondary-surface);
        border-radius: var(--radius-medium);
        padding: var(--size-large);
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid transparent;
        transition: var(--transition-all);
        box-shadow: var(--shadow-normal);
      }

      .reference-item:hover {
        box-shadow: var(--shadow-hover);
      }

      .reference-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--size-small);
      }

      .reference-file {
        font-size: var(--font-medium);
        font-weight: 500;
        color: var(--color-primary-text);
      }

      .reference-meta {
        font-size: var(--font-small);
        color: var(--color-secondary-text);
      }

      .reference-when-to-use {
        display: flex;
        flex-wrap: wrap;
        gap: var(--size-small);
        margin-top: var(--size-medium);
      }

      .reference-tag {
        background: var(--color-secondary-surface-active);
        padding: var(--size-small);
        border-radius: var(--radius-medium);
        font-size: var(--font-tiny);
        font-weight: 500;
        text-transform: uppercase;
      }

      .reference-actions {
        display: flex;
        gap: var(--size-small);
      }

      .action-button {
        background: none;
        border: none;
        color: var(--color-secondary-text);
        cursor: pointer;
        padding: var(--size-small);
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition-all);
      }

      .action-button:hover {
        background: var(--color-secondary-surface-active);
        color: var(--color-primary-text);
      }

      .edit-button:hover {
        background: var(--color-2);
        color: white;
      }

      .remove-button:hover {
        background: var(--color-error);
        color: white;
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

      .modal-body {
        display: flex;
        flex-direction: column;
        gap: var(--size-large);
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: var(--size-small);
      }

      .form-label {
        font-weight: 500;
        color: var(--color-primary-text);
      }

      .form-input {
        width: 100%;
        padding: var(--size-medium);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-medium);
        background: var(--color-primary-surface);
        color: var(--color-primary-text);
        transition: var(--transition-all);
      }

      .form-input:focus {
        outline: none;
        border-color: var(--color-accent);
        box-shadow: var(--shadow-active);
      }

      .form-textarea {
        width: 100%;
        padding: var(--size-medium);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-medium);
        background: var(--color-primary-surface);
        color: var(--color-primary-text);
        resize: none;
        transition: var(--transition-all);
        box-sizing: border-box;
      }

      .form-textarea:focus {
        outline: none;
        border-color: var(--color-accent);
        box-shadow: var(--shadow-active);
      }

      .checkbox-group {
        display: flex;
        flex-wrap: wrap;
        gap: var(--size-small);
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: var(--size-small);
        cursor: pointer;
        border-radius: var(--radius-small);
      }

      .checkbox-label:hover {
      }

      .checkbox-text {
        text-transform: capitalize;
        padding: var(--size-medium);
        border-radius: var(--radius-medium);
        transition: var(--transition-all);
      }

      .checkbox-text:hover {
        background: var(--color-secondary-surface-active);
      }

      input[type="checkbox"] {
        display: none;
      }

      input[type="checkbox"]:checked ~ .checkbox-text {
        background-color: var(--color-1);
      }

      .file-info {
        font-size: var(--font-small);
        color: var(--color-secondary-text);
        margin-top: var(--size-small);
      }

      .file-upload-area {
        position: relative;
      }

      .file-input {
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        z-index: 2;
      }

      .file-upload-label {
        display: block;
        cursor: pointer;
        border: 2px dashed var(--color-border);
        border-radius: var(--radius-medium);
        background: var(--color-primary-surface);
        transition: var(--transition-all);
        overflow: hidden;
      }

      .file-upload-label:hover {
        border-color: var(--color-accent);
        background: var(--color-secondary-surface-active);
      }

      .file-upload-content {
        padding: 0 var(--size-xl);
        min-height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .file-upload-placeholder {
        text-align: center;
        color: var(--color-secondary-text);
        padding: var(--size-large);
      }

      .upload-text {
        margin-bottom: var(--size-small);
        font-size: var(--font-medium);
      }

      .upload-text strong {
        color: var(--color-accent);
      }

      .upload-hint {
        font-size: var(--font-small);
        opacity: 0.8;
      }

      .file-selected {
        display: flex;
        align-items: center;
        gap: var(--size-medium);
        width: 100%;
        border-radius: var(--radius-small);
        padding: var(--size-medium);
      }

      .file-details {
        flex: 1;
        min-width: 0;
      }

      .file-name {
        font-weight: 500;
        color: var(--color-primary-text);
        word-break: break-all;
        margin-bottom: 2px;
      }

      .file-size {
        font-size: var(--font-small);
        color: var(--color-secondary-text);
      }

      /* Drag and drop states */
      .file-upload-area.drag-over .file-upload-label {
        border-color: var(--color-success);
        background: rgba(16, 185, 129, 0.1);
        transform: scale(1.02);
      }

      @keyframes bounce {
        0%,
        20%,
        50%,
        80%,
        100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-5px);
        }
        60% {
          transform: translateY(-3px);
        }
      }
    `,
  ];

  @consume({ context: bookContext, subscribe: true })
  @property({ attribute: false })
  public bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  @property({ attribute: false })
  public instructions: string = "";

  @property({ attribute: false })
  public whenToUse: ReferenceUse[] = [];

  @query("torlify-modal") modal!: TorlifyModal;
  @query('input[type="file"]') fileInput!: HTMLInputElement;
  @query(".file-upload-area") uploadArea!: HTMLElement;

  private editingIndex: number | null = null;
  private selectedFile: File | null = null;

  override render(): TemplateResult {
    const references = this.bookContext.book?.references || [];

    return html`
      <div class="references-container">
        <div class="references-header">
          <h4 class="references-title">References</h4>
          <button class="add-button" @click="${this.addReference}">
            ${plusIcon} Add Reference
          </button>
        </div>

        ${references.length === 0
          ? html`
              <div class="empty-state">
                No references added yet. Click "Add Reference" to get started.
              </div>
            `
          : html`
              <div class="references-list">
                ${references.map(
                  (reference, index) => html`
                    <div class="reference-item">
                      <div class="reference-info">
                        <div class="reference-file">${reference.file}</div>
                        <div class="reference-meta">
                          ${reference.instructions
                            ? html`<div>${reference.instructions}</div>`
                            : html`<div>No instructions provided</div>`}
                          <div class="reference-when-to-use">
                            ${reference.whenToUse.map(
                              (use) => html`
                                <span class="reference-tag">${use}</span>
                              `,
                            )}
                          </div>
                        </div>
                      </div>
                      <div class="reference-actions">
                        <button
                          class="action-button edit-button"
                          @click="${(): void => this.editReference(index)}"
                          title="Edit reference"
                        >
                          ${editIcon}
                        </button>
                        <button
                          class="action-button remove-button"
                          @click="${(): void => this.removeReference(index)}"
                          title="Remove reference"
                        >
                          ${trashIcon}
                        </button>
                      </div>
                    </div>
                  `,
                )}
              </div>
            `}
      </div>

      <torlify-modal
        .title="${this.editingIndex !== null
          ? "Edit Reference"
          : "Add Reference"}"
        @ModelSubmit="${this.handleModalSubmit}"
      >
        <div slot="body">${this.renderModalContent()}</div>
        <button slot="submit-button" class="standard-button">
          ${this.editingIndex !== null ? "Update Reference" : "Add Reference"}
        </button>
      </torlify-modal>
    `;
  }

  private renderModalContent(): TemplateResult {
    return html`
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Reference File</label>
          <div
            class="file-upload-area"
            @dragover="${this.handleDragOver}"
            @dragleave="${this.handleDragLeave}"
            @drop="${this.handleDrop}"
          >
            <input
              id="file-input"
              class="file-input"
              type="file"
              @change="${(e: Event): void =>
                this.handleFileSelect(e.target as HTMLInputElement)}"
              accept=".txt,.md,.pdf,.doc,.docx"
            />
            <label for="file-input" class="file-upload-label">
              <div class="file-upload-content">
                ${this.selectedFile
                  ? html`
                      <div class="file-selected">
                        <div class="file-details">
                          <div class="file-name">${this.selectedFile.name}</div>
                          <div class="file-size">
                            ${this.formatFileSize(this.selectedFile.size)}
                          </div>
                        </div>
                      </div>
                    `
                  : html`
                      <div class="file-upload-placeholder">
                        <div class="upload-text">
                          <strong>Click to select</strong> or drag and drop
                        </div>
                        <div class="upload-hint">
                          Supports: TXT, MD, PDF, DOC, DOCX
                        </div>
                      </div>
                    `}
              </div>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Instructions</label>
          <textarea
            class="form-textarea"
            .value="${this.instructions}"
            @input="${this.handleInstructionsInput}"
            placeholder="Instructions for using this reference"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">When to Use</label>
          <div class="checkbox-group">
            ${ReferenceUse.options.map(
              (option) => html`
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    .checked="${this.whenToUse.includes(option)}"
                    @change="${(): void => this.toggleWhenToUse(option)}"
                  />
                  <span class="checkbox-text">${option}</span>
                </label>
              `,
            )}
          </div>
        </div>
      </div>
    `;
  }

  toggleWhenToUse(option: ReferenceUse): void {
    if (this.whenToUse.includes(option)) {
      this.whenToUse = this.whenToUse.filter((use) => use !== option);
    } else {
      this.whenToUse = [...this.whenToUse, option];
    }
  }

  private handleInstructionsInput(e: Event): void {
    this.instructions = (e.target as HTMLTextAreaElement).value;
  }

  private addReference(): void {
    this.instructions = "";
    this.whenToUse = [];
    this.editingIndex = null;
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.value = "";
    }
    this.modal.open();
  }

  private editReference(index: number): void {
    this.instructions =
      this.bookContext.book?.references[index]?.instructions || "";
    this.whenToUse = this.bookContext.book?.references[index]?.whenToUse || [];
    this.editingIndex = index;
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.value = "";
    }
    this.requestUpdate();
    this.modal.open();
  }

  private removeReference(index: number): void {
    const currentReferences = this.bookContext.book?.references || [];
    const newReferences = currentReferences.filter((_, i) => i !== index);
    this.bookContext.book!.references = newReferences;
    this.requestUpdate();

    const updateData = buildNestedObject(
      BookPartial,
      "references",
      newReferences,
    );
    dispatch(this, UpdateBookEvent(updateData));
  }

  private updateReference(): void {
    if (this.bookContext.book?.references[this.editingIndex!]) {
      this.bookContext.book.references[this.editingIndex!] = {
        instructions: this.instructions,
        whenToUse: this.whenToUse,
        file: this.bookContext.book?.references[this.editingIndex!].file,
      };
      dispatch(
        this,
        UpdateBookEvent({
          references: this.bookContext.book?.references || [],
        }),
      );
    }
  }

  private async handleModalSubmit(): Promise<void> {
    if (this.editingIndex === null) {
      this.handleModalSubmitCreate();
    } else {
      this.handleModalSubmitEdit();
    }
  }

  private async handleModalSubmitCreate(): Promise<void> {
    if (this.selectedFile) {
      const uploadResult = await uploadReferenceService.fetch({
        book: this.bookContext.book!.id,
        filename: this.selectedFile.name,
        file: this.selectedFile,
      });


      if (uploadResult.success) {
        this.bookContext.book!.references.push({
          instructions: this.instructions,
          whenToUse: this.whenToUse,
          file: this.selectedFile.name,
        });
        this.requestUpdate();
        dispatch(
          this,
          UpdateBookEvent({
            references: this.bookContext.book?.references || [],
          }),
        );
      }
    } else {
      dispatch(this, WarningEvent("Please select a file to upload."));
    }
  }

  private async handleModalSubmitEdit(): Promise<void> {
    if (this.selectedFile) {
      const uploadResult = await uploadReferenceService.fetch({
        book: this.bookContext.book!.id,
        filename: this.selectedFile.name,
        file: this.selectedFile,
      });

      if (uploadResult.success) {
        this.updateReference();
      }
    } else {
      this.updateReference();
    }

    this.modal.close();
    this.editingIndex = null;
    this.selectedFile = null;
    this.instructions = "";
    this.whenToUse = [];
  }

  private handleFileSelect(input: HTMLInputElement): void {
    const file = input.files?.[0] || null;
    this.setSelectedFile(file);
  }

  private setSelectedFile(file: File | null): void {
    this.selectedFile = file;
    if (this.bookContext.book?.references[this.editingIndex!]) {
      this.bookContext.book.references[this.editingIndex!].file = file
        ? file.name
        : "";
    }
    this.requestUpdate();
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  private handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.uploadArea?.classList.add("drag-over");
  }

  private handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.uploadArea?.classList.remove("drag-over");
  }

  private handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.uploadArea?.classList.remove("drag-over");

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if file type is accepted
      const acceptedTypes = [".txt", ".md", ".pdf", ".doc", ".docx"];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

      if (acceptedTypes.includes(fileExtension)) {
        this.setSelectedFile(file);
        // Update the file input as well
        if (this.fileInput) {
          // Create a new DataTransfer to set files
          const dt = new DataTransfer();
          dt.items.add(file);
          this.fileInput.files = dt.files;
        }
      } else {
        // TODO: Show error message for unsupported file type
        console.warn("Unsupported file type:", fileExtension);
      }
    }
  }
}
