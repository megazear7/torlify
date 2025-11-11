import { css } from "lit";

export const globalStyles = css`
  a {
    color: var(--color-1);
  }

  button {
    background: var(--color-1);
    color: var(--color-secondary-text);
    outline: none;
    border: none;
    padding: var(--size-large) var(--size-xl);
    border-radius: var(--radius-large);
    font-size: var(--font-medium);
    font-family: var(--font-family);
    font-weight: 600;
    box-shadow: var(--shadow-normal);
    transition: var(--transition-all);
  }

  button:hover {
    background: var(--color-2);
    box-shadow: var(--shadow-hover);
    transform: var(--transform-hover);
  }
`;
