import { css } from "lit";

export const overlayStyles = css`
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity var(--time-normal) ease-in-out;
    pointer-events: none;
  }

  .overlay.visible {
    opacity: 1;
    pointer-events: auto;
  }
`;
