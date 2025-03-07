import "@testing-library/jest-dom";
import {
  TextDecoder as NodeTextDecoder,
  TextEncoder as NodeTextEncoder,
} from "util";
globalThis.TextEncoder = NodeTextEncoder as typeof TextEncoder;
globalThis.TextDecoder = NodeTextDecoder as typeof TextDecoder;
