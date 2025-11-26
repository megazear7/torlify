import { css } from "lit";

export const pillStyles = css`
  ul.pill {
    display: flex;
    gap: var(--size-medium);
    margin: var(--size-xl) 0 0 0;
    padding: 0;
    list-style: none;
    overflow: auto;
    scrollbar-width: none;
    padding: var(--size-large) 0;
  }

  ul.pill > li {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 auto;
    background: var(--color-secondary-surface);
    color: var(--color-secondary-text);
    border-radius: var(--radius-large);
    transition: var(--transition-all);
    cursor: pointer;
    font-weight: 500;
    box-shadow: var(--shadow-active);
    position: relative;
    overflow: hidden;
  }

  ul.pill > li::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: var(--color-tertiary-surface);
    opacity: 0;
    transition: var(--transition-all);
    border-radius: var(--radius-large);
    z-index: 0;
  }

  ul.pill > li.active {
    background-color: var(--color-1);
    color: var(--color-secondary-text);
  }

  ul.pill > li > * {
    z-index: 1;
  }

  ul.pill > li:hover::after {
    opacity: 1;
  }

  ul.pill > li:hover {
    background: var(--color-2);
    color: var(--color-tertiary-text);
    box-shadow: var(--shadow-hover);
  }

  ul.pill > li > * {
    display: flex;
    justify-content: center;
    align-items: center;
    color: inherit;
    text-decoration: none;
    padding: var(--size-small) var(--size-medium);
    position: relative;
    z-index: 1;
    transition: var(--transition-all);
  }

  ul.pill > li > * {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
  }
`;
