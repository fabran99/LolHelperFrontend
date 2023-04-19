import { electron } from "../helpers/outsideObjects";
const currentWindow = electron.remote.getCurrentWindow();

export const minimize = () => {
  currentWindow.minimize();
};
export const close = () => {
  currentWindow.close();
};
