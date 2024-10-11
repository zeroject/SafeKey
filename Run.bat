@echo off
echo Starting .NET backend...
cd SafeKeyBackend\TestingConsole
start dotnet run

echo Starting npm frontend...
cd ..
cd ..
cd Frontend
call npm install
call npm start

echo Both services have been started.
pause
