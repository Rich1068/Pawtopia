import SERVER_URL from "./envVariables";

export const getFullImageUrl = (path?: string) => {
  if (!path) return "/assets/img/Logo1.png";
  return `${SERVER_URL}${path}`;
};
