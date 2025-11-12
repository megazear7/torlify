import { html, TemplateResult } from "lit";

export const plusIcon = (): TemplateResult => html`
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="10" y="4" width="4" height="16" />
    <rect x="4" y="10" width="16" height="4" />
  </svg>
`;

export const aiIcon = (): TemplateResult => html`
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3L13.2 8.4L18.6 9.6L13.2 10.8L12 16.2L10.8 10.8L5.4 9.6L10.8 8.4L12 3Z"
      fill="currentColor"
    />
    <path
      d="M6 12L6.6 14.4L9 15L6.6 15.6L6 18L5.4 15.6L3 15L5.4 14.4L6 12Z"
      fill="currentColor"
    />
    <path
      d="M18 12L18.6 14.4L21 15L18.6 15.6L18 18L17.4 15.6L15 15L17.4 14.4L18 12Z"
      fill="currentColor"
    />
  </svg>
`;
