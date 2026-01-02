export {};

declare global {
  interface Window {
    HS: {
      init: () => void;
    };
  }
}
