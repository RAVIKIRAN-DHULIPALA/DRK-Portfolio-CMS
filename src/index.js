import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {
  CssBaseline,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material";

import "./styles/global.css";
import MUIThemeProvider from "./Providers/MUIThemeProvider";


const muiTheme = MUIThemeProvider();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={muiTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StyledEngineProvider>
);

