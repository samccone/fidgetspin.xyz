// Add missing webkit audio type
declare const webkitAudioContext: {
  new (): AudioContext;
};

declare const requestIdleCallback: {
  (fn: () => void, opts?: { timeout?: number }): void;
};

interface WhatWGEventListenerArgs {
  capture?: boolean;
}

interface WhatWGAddEventListenerArgs extends WhatWGEventListenerArgs {
  passive?: boolean;
  once?: boolean;
}

type WhatWGAddEventListener = (
  type: string,
  listener: (event: Event) => void,
  options?: WhatWGAddEventListenerArgs
) => void;
