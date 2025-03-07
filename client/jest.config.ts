export default {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "src/constants": "<rootDir>/__mocks__/constantsMock.ts",
  },
  moduleFileExtensions: ["ts", "js", "tsx", "jsx", "d.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
