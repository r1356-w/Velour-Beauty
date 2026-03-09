@echo off
setlocal

echo === Node processes ===
tasklist | findstr /I node

echo.
echo === Ports 3000 / 5001 ===
netstat -ano | findstr ":3000"
netstat -ano | findstr ":5001"

echo.
echo === Health check ===
curl -s http://127.0.0.1:5001/api/health

echo.
pause
