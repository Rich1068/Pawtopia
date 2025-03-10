import "@testing-library/jest-dom";
import {
  TextDecoder as NodeTextDecoder,
  TextEncoder as NodeTextEncoder,
} from "util";
import serverAPI from "./src/helper/axios";
globalThis.TextEncoder = NodeTextEncoder as typeof TextEncoder;
globalThis.TextDecoder = NodeTextDecoder as typeof TextDecoder;

jest.mock("./src/helper/axios", () => ({
  default: {
    get: jest.fn(),
  },
}));

serverAPI.get = jest.fn();
jest.mock("./src/helper/envVariables", () => ({
  VITE_SERVER_URL: "http://localhost:8000",
}));

jest.mock("lucide-react");
