declare module 'socket.io-json-parser' {
    export class Encoder {
        public encode(packet: string, callback: Function): void;
    }

    export class Decoder {
        public add(obj: object): void;
        public destroy(): void;
    }

    export const CONNECT: number;
    export const DISCONNECT: number;
    export const EVENT: number;
    export const ACK: number;
    export const ERROR: number;
    export const BINARY_EVENT: number;
    export const BINARY_ACK: number;
}
