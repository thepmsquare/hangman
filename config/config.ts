import Config from "@/types/Config";

const config: Config = {
  appName: "hangman",
  maxLives: 6,
  defaultTheme: "dark",
  localStorageVariableNames: {
    score: "thepmsquare-hangman-score",
    theme: "thepmsquare-hangman-theme",
  },
};
export default config;
