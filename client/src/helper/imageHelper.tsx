import SERVER_URL from "./envVariables";

export const getFullImageUrl = (path?: string) => {
  if (!path) return "/assets/img/Logo1.png";
  return `${SERVER_URL}${path}`;
};

export const cleanImageUrl = (url: string | undefined): string | undefined => {
  let cleanedUrl = url?.split("?")[0];
  cleanedUrl = cleanedUrl?.replace(/\/\d+(?=\.\w+$)/, "");
  cleanedUrl = cleanedUrl?.replace(/\.\w+$/, "");
  return cleanedUrl;
};
