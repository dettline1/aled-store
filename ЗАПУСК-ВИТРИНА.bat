@echo off
chcp 65001 >nul
cls

echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo              🛍️ ЗАПУСК ВИТРИНЫ МАГАЗИНА
echo.
echo ════════════════════════════════════════════════════════════════
echo.

REM Проверка Node.js
echo [Проверка] Проверяю Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js не установлен!
    echo.
    echo Скачайте и установите с: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js установлен
echo.

REM Создание .env.local для витрины
if not exist "apps\frontend\.env.local" (
    echo [1/2] Создаю конфиг .env.local...
    echo NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1 > apps\frontend\.env.local
    echo NEXT_PUBLIC_USE_API=true >> apps\frontend\.env.local
    echo ✅ Конфиг создан
) else (
    echo [1/2] ✅ Конфиг .env.local уже существует
)
echo.

REM Проверка зависимостей frontend
echo [2/2] Проверяю зависимости Витрины...
if not exist "apps\frontend\node_modules" (
    echo.
    echo 📦 Устанавливаю зависимости для Витрины...
    echo    (Это может занять 2-3 минуты, подождите...)
    cd apps\frontend
    call npm install
    cd ..\..
    echo ✅ Зависимости Витрины установлены
) else (
    echo ✅ Зависимости Витрины уже установлены
)
echo.

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo              🚀 ЗАПУСКАЮ ВИТРИНУ...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

start "⚡ ALed Frontend - НЕ ЗАКРЫВАТЬ!" cmd /k "echo. && echo ════════════════════════════════════════ && echo     ALed Store Frontend && echo ════════════════════════════════════════ && echo. && cd apps\frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo ✅ Витрина запущена: http://localhost:3000
echo.

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo                    ✨✨✨ ГОТОВО! ✨✨✨
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo.
echo  🛍️ Откройте в браузере:
echo.
echo     Витрина магазина:
echo     👉 http://localhost:3000
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo.
echo  ⚠️  ВАЖНО:
echo.
echo     • Открылось окно "ALed Frontend"
echo     • НЕ ЗАКРЫВАЙТЕ его - оно должно работать!
echo     • Это окно можно закрыть
echo.
echo  🛑 Чтобы остановить витрину:
echo.
echo     • Закройте черное окно "ALed Frontend"
echo     • Или запустите ОСТАНОВИТЬ.bat
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo.
pause

