"use client";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: 'Poppins', monospace;
  }

  button {
    cursor: pointer;
    transition: background 0.2s;
  }
`;

export default GlobalStyle;
