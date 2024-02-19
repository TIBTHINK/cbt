interface SamJsOptions {
  phonetic?: boolean;
  singmode?: boolean;
  debug?: boolean;
  pitch?: number;
  speed?: number;
  mouth?: number;
  throat?: number;
}

interface SamJsSpeakPromise extends Promise<true> {
  abort: (reason: any) => void;
}

declare class SamJs {
  constructor(options?: SamJsOptions);
  buf8(text: string, phonetic?: boolean): Uint8Array | Boolean;
  buf32(text: string, phonetic?: boolean): Float32Array | Boolean;
  speak(text: string, phonetic?: boolean): SamJsSpeakPromise;
  download(text: string, phonetic?: boolean): void;
}

declare module "sam-js" {
  export = SamJs;
}
