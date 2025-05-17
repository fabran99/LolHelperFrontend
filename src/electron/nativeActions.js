import { electron } from "../helpers/outsideObjects";
const currentWindow = electron.remote.getCurrentWindow();

export const minimize = () => {
  currentWindow.minimize();
};
export const close = () => {
  currentWindow.close();
};

export const handleSelectFolder = async (defaultPath) => {
  const { dialog } = electron.remote;
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
    defaultPath,
  });
  if (result.canceled) {
    console.log("User canceled the dialog");
    return;
  } else {
    const selectedFolder = result.filePaths[0];
    console.log("Selected folder:", selectedFolder);
    return selectedFolder;
  }
};
