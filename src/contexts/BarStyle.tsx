import React, { useState, createContext, FC } from "react";

const BarStyleContext = createContext({
  barStyle: "light",
  dispatch: (style: string) => {},
});

const BarStyleProvider = ({ children }: { children: any }) => {
  const [barStyle, setBarStyle] = useState("dark-content");
  const dispatch = (style: string) => {
    setBarStyle(style);
  };
  const value = { barStyle, dispatch };
  return (
    <BarStyleContext.Provider value={value}>
      {children}
    </BarStyleContext.Provider>
  );
};

export { BarStyleContext, BarStyleProvider };
