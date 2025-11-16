import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./page.home.js";
import "./page.book.js";
import "./page.chapter.js";
import "./page.part.js";
import "./page.not-found.js";
import { RouteConfig, RouteName } from "../shared/type.routes.js";
import { parseRouteParams } from "../shared/util.route-params.js";
import { routes } from "../shared/service.client.js";
import { TorlifyAbstractProvider } from "./provider.abstract.js";

@customElement("torlify-app")
export class TorlifyApp extends LitElement {
  routes: RouteConfig[] = routes;

  @property({ type: String }) currentRoute: RouteConfig | null =
    this.determineRouteName();

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("click", this.navigate.bind(this));
  }

  override render(): TemplateResult {
    if (this.currentRoute) {
      switch (this.currentRoute.name) {
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
    } else {
      return html`<torlify-not-found-page></torlify-not-found-page>`;
    }
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
      const tagName = `torlify-${this.currentRoute!.name.replace(/_/g, "-")}-page`;
      const pageElement = this.shadowRoot?.querySelector(tagName);
      const provider = pageElement as TorlifyAbstractProvider;
      if (provider && provider.load && typeof provider.load === "function") {
        await provider.load();
        provider.requestUpdate();
      } else {
        console.warn("Provider or load method not found for", tagName);
      }
      this.requestUpdate();
    }
  }
}
