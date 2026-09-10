@echo off
setlocal
cd /d "%~dp0"
set PORT=8090

where node >nul 2>nul
if %errorlevel%==0 (
  echo Starting Menulytr menus at http://localhost:%PORT%
  start "" http://localhost:%PORT%/
  node serve.js "%~dp0" %PORT%
  goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
  echo Starting Menulytr menus at http://localhost:%PORT%
  start "" http://localhost:%PORT%/
  python -m http.server %PORT%
  goto :eof
)

echo Neither Node.js nor Python was found. Install Node.js from https://nodejs.org and run this again.
pause
