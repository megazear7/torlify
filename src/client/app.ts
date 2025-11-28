import { html, LitElement, PropertyValues, TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { RouteConfig, RouteName } from "../shared/type.routes.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { routes } from "../shared/service.client.js";
import { TorlifyAbstractProvider } from "./provider.abstract.js";
import { TorlifyToast } from "./component.toast.js";
import { TorlifySaveIndicator } from "./component.save-indicator.js";
import { SaveEventName } from "./event.save.js";
import { NavigationEventName } from "./event.navigation.js";
import { SuccessEventName } from "./event.success.js";
import { WarningEventName } from "./event.warning.js";
import "./page.home.js";
import "./page.book.js";
import "./page.chapter.js";
import "./page.part.js";
import "./page.not-found.js";
import "./component.toast.js";
import "./component.save-indicator.js";

@customElement("torlify-app")
export class TorlifyApp extends LitElement {
  routes: RouteConfig[] = routes;

  @property({ type: String })
  currentRoute: RouteConfig | null = this.determineRouteName();

  @property({ type: String }) toastMessage = "";
  @property({ type: String }) toastType:
    | "error"
    | "warning"
    | "success"
    | "info" = "info";
  @property({ type: Boolean }) toastVisible = false;
  @query("torlify-toast") toast!: TorlifyToast;
  @query("torlify-save-indicator") saveIndicator!: TorlifySaveIndicator;

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("click", this.navigate.bind(this));
    document.addEventListener(WarningEventName.value, (event: Event) => {
      const customEvent = event as CustomEvent;
      this.toast.show(customEvent.detail.message, "warning");
    });
    document.addEventListener(SuccessEventName.value, (event: Event) => {
      const customEvent = event as CustomEvent;
      this.toast.show(customEvent.detail.message, "success");
    });
    document.addEventListener(NavigationEventName.value, (event: Event) => {
      const customEvent = event as CustomEvent;
      window.history.pushState({}, "", customEvent.detail.path);
      this.currentRoute = this.determineRouteName();
      this.requestUpdate();
    });

    this.addEventListener(SaveEventName.value, this.handleSaveEvent);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener(SaveEventName.value, this.handleSaveEvent);
  }

  override render(): TemplateResult {
    const pageContent = this.currentRoute
      ? ((): TemplateResult => {
          switch (this.currentRoute!.name) {
            case RouteName.enum.home:
              return html`<torlify-home-page></torlify-home-page>`;
            case RouteName.enum.book:
              return html`<torlify-book-page></torlify-book-page>`;
            case RouteName.enum.chapter:
              return html`<torlify-chapter-page></torlify-chapter-page>`;
            case RouteName.enum.part:
              return html`<torlify-part-page></torlify-part-page>`;
            default:
              return html`<torlify-not-found-page></torlify-not-found-page>`;
          }
        })()
      : html`<torlify-not-found-page></torlify-not-found-page>`;

    return html`
      ${pageContent}
      <torlify-toast
        .message="${this.toastMessage}"
        .type="${this.toastType}"
        .visible="${this.toastVisible}"
        @close="${this.handleToastClose}"
      ></torlify-toast>
      <torlify-save-indicator></torlify-save-indicator>
    `;
  }

  determineRouteName(): RouteConfig | null {
    const pathname = window.location.pathname;

    for (const route of this.routes) {
      try {
        const params = parseRouteParams(route.path, pathname);
        if (params !== null) {
          return route;
        }
      } catch {
        // Ignore parsing errors and continue to next route
      }
    }

    return null;
  }

  async navigate(event: Event): Promise<void> {
    let target: HTMLAnchorElement | null = null;
    for (const el of event.composedPath()) {
      if (el instanceof HTMLElement && el.tagName === "A") {
        target = el as HTMLAnchorElement;
        break;
      }
    }

    if (target && target.href && !target.hasAttribute("download")) {
      event.preventDefault();
      sessionStorage.setItem("previousUrl", "");
      const url = new URL(target.href);
      const path = url.pathname;
      window.history.pushState({}, "", path);
      this.currentRoute = this.determineRouteName();
      this.requestUpdate();
    }
  }

  protected override update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    const tagName = `torlify-${this.currentRoute!.name.replace(/_/g, "-")}-page`;
    const pageElement = this.shadowRoot?.querySelector(tagName);
    const provider = pageElement as TorlifyAbstractProvider;
    if (provider && provider.load && typeof provider.load === "function") {
      provider.load().then(() => provider.requestUpdate());
    } else {
      this.toast.show("Failed to load page data.", "error");
      console.warn("Provider or load method not found for", tagName);
    }
  }

  private handleToastClose(): void {
    this.toastVisible = false;
    this.requestUpdate();
  }

  private handleSaveEvent(): void {
    this.saveIndicator.show();
  }
}
