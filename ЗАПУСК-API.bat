@echo off
chcp 65001 >nul
cls

echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo              🚀 БЫСТРЫЙ ЗАПУСК API
echo.
echo ════════════════════════════════════════════════════════════════
echo.

cd demo-api

echo [1/2] Проверка зависимостей...
if not exist node_modules (
    echo Установка зависимостей...
    call npm install
) else (
    echo ✅ Зависимости уже установлены
)
echo.

echo [2/2] Запуск API сервера...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo   📍 API:  http://localhost:4000
echo   📚 Docs: http://localhost:4000/docs
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

call npm start

