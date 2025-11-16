import { LitElement } from "lit";
import "./component.book-editor.js";

export abstract class TorlifyAbstractProvider extends LitElement {
  abstract load(): Promise<void>;
}
