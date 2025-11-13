@echo off
echo ======================================
echo    ALed Store Demo API
echo ======================================
echo.
echo Очистка старых зависимостей...
cd demo-api
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo.
echo Установка новых зависимостей...
call npm install
echo.
echo Запуск API сервера...
echo.
call npm start
pause
