import { html, css, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { globalStyles } from "./styles.global.js";
import z from "zod";
import { overlayStyles } from "./styles.overlay.js";
import { xIcon } from "./icons.js";
import { ANIMATION_SPEED_IN_MS } from "../shared/util.time.js";
import { WarningEventDetail } from "./event.warning.js";
import { SuccessEventDetail } from "./event.success.js";

export const NotificationType = z.enum(["success", "warning"]);
export type NotificationType = z.infer<typeof NotificationType>;

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  info: string | undefined;
  timestamp: Date;
  dismissing: boolean;
}

export const NotificationFilter = z.enum(["all", "success", "warning"]);
export type NotificationFilter = z.infer<typeof NotificationFilter>;

@customElement("inklify-notification-manager")
export class InklifyNotificationManager extends LitElement {
  static override styles = [
    globalStyles,
    overlayStyles,
    css`
      .notification-circle {
        position: fixed;
        top: var(--size-large);
        right: var(--size-large);
        width: var(--size-large);
        height: var(--size-large);
        border-radius: 50%;
        background-color: var(--color-secondary-surface);
        color: var(--color-primary-text-muted);
        text-align: center;
        line-height: var(--size-large);
        font-size: var(--font-small);
        cursor: pointer;
        box-shadow: var(--shadow-normal);
        transition: var(--transition-all);
      }

      .notification-circle:hover {
        box-shadow: var(--shadow-hover);
        color: var(--color-primary-text);
      }

      .overlay-close {
        position: absolute;
        top: var(--size-xl);
        right: var(--size-xl);
        cursor: pointer;
        color: var(--color-primary-text-muted);
        transition: var(--transition-all);
      }

      .overlay-close svg {
        width: var(--size-xl);
        height: var(--size-xl);
      }

      .overlay-close:hover {
        color: var(--color-primary-text);
      }

      .standard-button.active {
        background-color: var(--color-1);
        color: var(--color-on-1);
      }

      .notification-content {
        position: relative;
        top: 20vh;
        height: 100vh;
        width: 400px;
        display: flex;
        flex-direction: column;
        gap: var(--size-xl);
        align-items: center;
      }

      .notification-header {
        display: flex;
        flex-direction: column;
      }

      .notification-list {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: var(--size-large);
        width: 100%;
      }

      .notification-item {
        position: relative;
        box-sizing: border-box;
        background: var(--color-secondary-surface);
        border-radius: var(--radius-medium);
        width: 100%;
        padding: var(--size-medium);
        display: flex;
        flex-direction: column;
        gap: var(--size-small);
      }

      .notification-remove {
        opacity: 0;
        position: absolute;
        right: calc(-1 * var(--size-xl));
        cursor: pointer;
        color: var(--color-primary-text-muted);
        transition: var(--transition-all);
        height: 100%;
        top: 0;
        display: flex;
        align-items: center;
        transition: var(--transition-all);
      }

      .notification-remove svg {
        width: var(--size-xl);
        height: var(--size-xl);
      }

      .notification-remove:hover {
        color: var(--color-primary-text);
      }

      .notification-item:hover .notification-remove {
        opacity: 1;
      }

      .notification-message {
        text-align: center;
      }

      .notification-info {
        text-align: center;
        font-size: calc(var(--font-small) * 0.9);
        color: var(--color-primary-text-muted);
      }

      .no-notifications {
        text-align: center;
        font-style: italic;
      }

      .notification-item.dismissing {
        animation: dismissNotification ${ANIMATION_SPEED_IN_MS}ms forwards;
      }

      @keyframes dismissNotification {
        from {
          opacity: 1;
          right: 0;
          transform: scale(1, 1);
        }
        to {
          opacity: 0;
          right: 100vw;
          transform: scale(0, 0);
        }
      }
    `,
  ];

  @state()
  private notifications: Notification[] = [];

  @state()
  private filter: NotificationFilter = "all";

  @state()
  private maxNotifications = 50;

  @property({ type: Boolean, attribute: false })
  private _visible = false;

  override render(): TemplateResult {
    const visibleNotifications = this.getFilteredNotifications();
    const count = this.notifications.length;

    return html`
      ${count > 0
        ? html`
            <div class="notification-circle" @click=${this.toggle()}>${count}</div>
          `
        : ""}
      <div class="overlay ${this.visible ? "visible" : ""}">
        <div class="overlay-close" @click=${this.toggle()}>${xIcon}</div>
        <div class="notification-content">
          <div class="notification-header">
            <button class="standard-button small" @click=${this.clearAllNotifications}>Clear All</button>
            <inklify-bar>
              <button
                class="standard-button ${this.filter === NotificationFilter.enum.all ? "active" : ""}"
                @click=${this.setFilter(NotificationFilter.enum.all)}>
                All
              </button>
              <button
                class="standard-button ${this.filter === NotificationFilter.enum.success ? "active" : ""}"
                @click=${this.setFilter(NotificationFilter.enum.success)}>
                Success
              </button>
              <button
                class="standard-button ${this.filter === NotificationFilter.enum.warning ? "active" : ""}"
                @click=${this.setFilter(NotificationFilter.enum.warning)}>
                Warning
              </button>
            </inklify-bar>
          </div>
          <div class="notification-list">
            ${visibleNotifications.length === 0
              ? html`
                  <div class="no-notifications">No notifications</div>
                `
              : visibleNotifications.map(
                  (notification) => html`
                    <div class="notification-item ${notification.type} ${notification.dismissing ? "dismissing" : ""}">
                      <div class="notification-remove" @click=${this.removeNotification(notification)}>${xIcon}</div>
                      <div class="notification-message">${notification.message}</div>
                      ${notification.info
                        ? html`
                            <div class="notification-info">${notification.info}</div>
                          `
                        : ""}
                    </div>
                  `,
                )}
          </div>
        </div>
      </div>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.notifications = JSON.parse(window.localStorage.getItem("inklify-notifications") || "[]");
    document.addEventListener("Success", this.handleSuccessEvent);
    document.addEventListener("Warning", this.handleWarningEvent);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("Success", this.handleSuccessEvent);
    document.removeEventListener("Warning", this.handleWarningEvent);
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  private clearAllNotifications = (): void => {
    this.notifications = [];
    window.localStorage.setItem("inklify-notifications", JSON.stringify(this.notifications));
    this.requestUpdate();
  };

  private handleSuccessEvent = (event: Event): void => {
    const customEvent = event as CustomEvent;
    const detail = customEvent.detail as WarningEventDetail | SuccessEventDetail;
    this.addNotification("success", detail.message, detail.info);
  };

  private handleWarningEvent = (event: Event): void => {
    const customEvent = event as CustomEvent;
    const detail = customEvent.detail as WarningEventDetail | SuccessEventDetail;
    this.addNotification("warning", detail.message, detail.info);
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      this.close()();
    }
  };

  private removeNotification(notification: Notification): () => void {
    return () => {
      notification.dismissing = true;
      this.requestUpdate();
      setTimeout(() => {
        this.notifications = this.notifications.filter((n) => n.id !== notification.id);
        window.localStorage.setItem("inklify-notifications", JSON.stringify(this.notifications));
        this.requestUpdate();
      }, ANIMATION_SPEED_IN_MS);
    };
  }

  set visible(value: boolean) {
    this._visible = value;
    if (this._visible) {
      this.open()();
    } else {
      this.close()();
    }
  }

  get visible(): boolean {
    return this._visible;
  }

  private addNotification(type: NotificationType, message: string, info?: string): void {
    const notification: Notification = {
      id: crypto.randomUUID(),
      type,
      message,
      info,
      timestamp: new Date(),
      dismissing: false,
    };

    this.notifications = [notification, ...this.notifications].slice(0, this.maxNotifications);
    window.localStorage.setItem("inklify-notifications", JSON.stringify(this.notifications));
    this.requestUpdate();
  }

  private getFilteredNotifications(): Notification[] {
    if (this.filter === "all") {
      return this.notifications;
    }
    return this.notifications.filter((n) => n.type === this.filter);
  }

  setFilter(filter: NotificationFilter): () => void {
    return () => {
      this.filter = filter;
      this.requestUpdate();
    };
  }

  toggle(): () => void {
    return () => {
      this.visible = !this.visible;
    };
  }

  open(): () => void {
    return () => {
      window.document.body.style.overflow = "hidden";
      this._visible = true;
    };
  }

  close(): () => void {
    return () => {
      window.document.body.style.overflow = "auto";
      this._visible = false;
    };
  }
}
