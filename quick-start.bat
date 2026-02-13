@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 E-commerce Guardian Quick Start
echo =====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies.
    pause
    exit /b 1
)

REM Install Playwright browsers
echo 🌐 Installing Playwright browsers...
call npx playwright install
if %errorlevel% neq 0 (
    echo ❌ Failed to install Playwright browsers.
    pause
    exit /b 1
)

echo.
echo ✅ Setup complete!
echo.
echo Choose an option:
echo 1. Start the backend server ^(Maven^)
echo 2. Run Playwright tests
echo 3. Start monitoring daemon
echo 4. Run complete test suite
echo 5. View monitoring stats
echo 6. Generate monitoring report
echo 7. Exit
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" (
    echo.
    echo 🎯 Starting backend server...
    call mvn spring-boot:run
    goto end
)

if "%choice%"=="2" (
    echo.
    echo 🧪 Running Playwright tests...
    call npm test
    goto end
)

if "%choice%"=="3" (
    echo.
    echo 👁️  Starting monitoring daemon...
    call npm run daemon
    goto end
)

if "%choice%"=="4" (
    echo.
    echo 🏃 Running complete test suite...
    call node e2e-guardian.js
    goto end
)

if "%choice%"=="5" (
    echo.
    echo 📊 Viewing monitoring stats...
    call node daemon-ctl.js stats
    goto end
)

if "%choice%"=="6" (
    echo.
    echo 📝 Generating monitoring report...
    call node daemon-ctl.js report
    goto end
)

if "%choice%"=="7" (
    echo.
    echo 👋 Goodbye!
    goto end
)

echo.
echo ❌ Invalid choice. Please run the script again.
pause
exit /b 1

:end
pause
