import { css } from "lit";

export const globalStyles = css`
  svg {
    width: var(--size-large);
    height: var(--size-large);
  }

  a {
    color: var(--color-1);
  }

  button {
    background: none;
    border: none;
    color: inherit;
    font-size: inherit;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-small);
  }

  button.standard-button {
    background: var(--color-secondary-surface);
    color: var(--color-secondary-text);
    outline: none;
    padding: var(--size-large) var(--size-xl);
    border-radius: var(--radius-large);
    font-size: var(--font-medium);
    font-family: var(--font-family);
    font-weight: 600;
    box-shadow: var(--shadow-normal);
    transition: var(--transition-all);
  }

  button.standard-button:hover {
    background: var(--color-2);
    box-shadow: var(--shadow-hover);
    transform: var(--transform-hover);
  }

  torlify-modal button.standard-button {
    background: var(--color-secondary-light);
  }

  textarea {
    width: 100%;
    box-sizing: border-box;
    padding: var(--size-medium);
    border: 1px solid var(--color-grey-transparent);
    border-radius: var(--radius-medium);
    background: transparent;
    color: var(--color-secondary-text);
    font-family: var(--font-family);
    font-size: var(--font-medium);
    transition: var(--transition-all);
    margin-bottom: var(--size-large);
  }

  textarea:focus {
    outline: none;
    border-color: var(--color-1);
    box-shadow: var(--shadow-active);
  }

  textarea::placeholder {
    color: var(--color-grey-transparent);
  }

  .container {
    max-width: var(--content-width);
    margin: 0 auto;
  }

  .secondary-surface {
    background-color: var(--color-secondary-surface);
    color: var(--color-secondary-text);
    border-radius: var(--radius-medium);
    padding: var(--size-large) var(--size-xl);
    margin-top: var(--size-xl);
    box-shadow: var(--shadow-normal);
    transition: var(--transition-shadow);
  }

  .secondary-surface:hover {
    box-shadow: var(--shadow-hover);
  }
`;
