import { css } from "lit";

export const globalStyles = css`
  h1,
  input.h1,
  textarea.h1 {
    font-size: calc(var(--font-medium) * 2);
    font-weight: 700;
    margin: var(--size-xl) 0 var(--size-medium) 0;
    color: var(--color-primary-text);
    letter-spacing: -0.5px;
  }

  h2,
  input.h2,
  textarea.h2 {
    font-size: calc(var(--font-medium) * 1.6);
    font-weight: 600;
    margin: var(--size-medium) 0 var(--size-small) 0;
    color: var(--color-primary-text);
  }

  h3,
  input.h3,
  textarea.h3 {
    font-size: calc(var(--font-medium) * 1.4);
    font-weight: 500;
    margin: var(--size-medium) 0 var(--size-small) 0;
  }

  h4,
  input.h4,
  textarea.h4 {
    font-size: calc(var(--font-medium) * 1.2);
    font-style: italic;
    margin: var(--size-medium) 0 var(--size-small) 0;
    color: var(--color-accent);
  }

  h5,
  input.h5,
  textarea.h5 {
    font-size: calc(var(--font-medium) * 0.85);
    font-style: italic;
    margin: var(--size-small) 0 0 0;
    color: var(--color-primary-text);
    opacity: 0.85;
  }

  h6,
  input.h6,
  textarea.h6 {
    font-size: calc(var(--font-medium) * 0.75);
    text-transform: uppercase;
    margin: var(--size-small) 0 var(--size-tiny) 0;
    color: var(--color-primary-text);
    opacity: 0.85;
  }

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

  torlify-bar > button.standard-button {
    border-radius: 0;
    padding: var(--size-medium) var(--size-large);
    box-shadow: none;
  }

  torlify-bar > button.standard-button:last-child {
    border-radius: 0 var(--radius-large) var(--radius-large) 0;
  }

  torlify-bar > button.standard-button:first-child {
    border-radius: var(--radius-large) 0 0 var(--radius-large);
  }

  torlify-bar > button.standard-button:only-child {
    border-radius: var(--radius-large);
  }

  input[type="text"] {
    width: 100%;
    box-sizing: border-box;
    padding: var(--size-large);
    border: 1px solid var(--color-grey-transparent);
    border-radius: var(--radius-medium);
    background: transparent;
    color: var(--color-secondary-text);
    font-family: var(--font-family);
    font-size: var(--font-medium);
    transition: var(--transition-all);
    margin-bottom: var(--size-large);
  }

  input[type="text"]:focus {
    outline: none;
    border-color: var(--color-1);
    box-shadow: var(--shadow-active);
    background: var(--color-secondary-surface-active);
  }

  input[type="text"]::placeholder {
    color: var(--color-grey-transparent);
  }

  torlify-modal button.standard-button {
    background: var(--color-secondary-bold);
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

  torlify-modal torylify-auto-textarea textarea {
    max-height: 50vh;
    overflow-y: auto;
  }
`;
