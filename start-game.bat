@echo off
setlocal
cd /d "%~dp0"

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-game.ps1"
set "GAME_EXIT_CODE=%ERRORLEVEL%"

if not "%GAME_EXIT_CODE%"=="0" (
  echo.
  echo Frontier Heroes was closed with an error.
  pause
)

exit /b %GAME_EXIT_CODE%
