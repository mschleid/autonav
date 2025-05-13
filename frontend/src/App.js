import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Tags from './components/Tags';
import Anchors from './components/Anchors';
import Waypoints from './components/Waypoints';
import Users from './components/Users';
import Preferences from './components/Preferences';
import {
  extendTheme as materialExtendTheme,
  CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Settings from './components/Preferences';

const materialTheme = materialExtendTheme();

function App() {

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="/" element={<Dashboard />}>
              <Route path="home" element={<Home />} />
              <Route path="tags" element={<Tags />} />
              <Route path="anchors" element={<Anchors />} />
              <Route path="waypoints" element={<Waypoints />} />
              <Route path="users" element={<Users />} />
              <Route path="preferences" element={<Preferences />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}

export default App;