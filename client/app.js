var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
let ParlioApp = class ParlioApp extends LitElement {
    constructor() {
        super(...arguments);
        this.test = "Somebody";
    }
    render() {
        return html `<p>${this.test}!</p>`;
    }
    async connectedCallback() {
        super.connectedCallback();
        this.test = await (await fetch("/health")).json();
    }
};
ParlioApp.styles = css `
    p {
      color: blue;
    }
  `;
__decorate([
    property()
], ParlioApp.prototype, "test", void 0);
ParlioApp = __decorate([
    customElement("parlio-app")
], ParlioApp);
export { ParlioApp };
//# sourceMappingURL=app.js.map