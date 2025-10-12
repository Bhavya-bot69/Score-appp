import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const themes = {
  light: {
    background: "#ffffff",
    color: "#000000",
    cardBackground: "#f9f9f9",
    buttonBackground: "#007bff",
    buttonColor: "#ffffff",
  },
  dark: {
    background: "#121212",
    color: "#ffffff",
    cardBackground: "#1e1e1e",
    buttonBackground: "#bb86fc",
    buttonColor: "#000000",
  },
  event: {
    background: "#ffefd5",
    color: "#5a2a27",
    cardBackground: "#ffe4c4",
    buttonBackground: "#ff7f50",
    buttonColor: "#ffffff",
  },
};

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState("light");
  const [theme, setTheme] = useState(themes.light);

  useEffect(() => {
    setTheme(themes[themeName]);
  }, [themeName]);

  const toggleTheme = (name) => {
    if (themes[name]) {
      setThemeName(name);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
