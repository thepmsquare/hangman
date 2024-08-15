import { PaletteMode } from "@mui/material";

interface Config {
  appName: string;
  maxLives: number;
  defaultTheme: PaletteMode;
  localStorageVariableNames: {
    theme: string;
  };
}
export default Config;
