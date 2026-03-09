@echo off
setlocal

set ROOT=C:\Users\rando\Downloads\velour
set BACKEND=%ROOT%\backend
set FRONTEND=%ROOT%\frontend

echo Starting backend on http://127.0.0.1:5001 ...
start "VELOUR BACKEND" cmd /k "cd /d %BACKEND% && node server.js"

timeout /t 2 >nul

echo Starting frontend on http://127.0.0.1:3000 ...
start "VELOUR FRONTEND" cmd /k "cd /d %FRONTEND% && cmd /c npm.cmd start"

echo.
echo Open these URLs after 20-40 seconds:
echo   http://127.0.0.1:5001/api/health
echo   http://127.0.0.1:3000
echo.
echo Keep both opened terminal windows running.
