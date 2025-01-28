'use client';
// https://github.com/mui/toolpad/blob/v0.12.0/examples/core/auth-nextjs-themed/README.md
import { createTheme } from '@mui/material/styles';
import getMPTheme from './getMPTheme';

const lightTheme = createTheme(getMPTheme('light'));
const darkTheme = createTheme(getMPTheme('dark'));

const theme = {
  light: lightTheme,
  dark: darkTheme,
};

export default theme;