import { css } from "lit";

export const globalStyles = css`
  a {
    color: var(--color-1);
  }

  button {
    display: flex;
    align-items: center;
    gap: var(--size-tiny);
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

  textarea {
    width: 100%;
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
`;
