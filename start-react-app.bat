@echo off
echo Starting Quiz App with React Frontend and Flask Backend
echo.

echo Starting Flask Backend Server...
start "Quiz Backend" cmd /k "cd backend && python quiz_server.py"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo Starting React Frontend...
start "Quiz Frontend" cmd /k "npm start"

echo.
echo Both servers are starting up!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
