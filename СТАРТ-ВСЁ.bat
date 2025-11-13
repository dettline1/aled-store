@echo off
chcp 65001 >nul
cls

echo.
echo    ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡
echo.
echo              ALed Store - ПОЛНЫЙ ЗАПУСК
echo              (API + Админка + Витрина)
echo.
echo    ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡
echo.
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

REM Проверка зависимостей API
echo [1/4] Проверяю зависимости API...
if not exist "demo-api\node_modules" (
    echo.
    echo 📦 Устанавливаю зависимости для API...
    echo    (Это может занять 1-2 минуты, подождите...)
    cd demo-api
    call npm install
    cd ..
    echo ✅ Зависимости API установлены
) else (
    echo ✅ Зависимости API уже установлены
)
echo.

REM Проверка зависимостей admin
echo [2/4] Проверяю зависимости Админки...
if not exist "apps\admin\node_modules" (
    echo.
    echo 📦 Устанавливаю зависимости для Админки...
    echo    (Это может занять 2-3 минуты, подождите...)
    cd apps\admin
    call npm install
    cd ..\..
    echo ✅ Зависимости Админки установлены
) else (
    echo ✅ Зависимости Админки уже установлены
)
echo.

REM Создание .env.local для витрины
if not exist "apps\frontend\.env.local" (
    echo [3/5] Создаю конфиг .env.local...
    echo NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1 > apps\frontend\.env.local
    echo NEXT_PUBLIC_USE_API=true >> apps\frontend\.env.local
    echo ✅ Конфиг создан
) else (
    echo [3/5] ✅ Конфиг .env.local уже существует
)
echo.

REM Проверка зависимостей frontend
echo [4/5] Проверяю зависимости Витрины...
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

REM Остановка старых процессов
echo [5/5] [Очистка] Останавливаю старые процессы...
taskkill /F /FI "WINDOWTITLE eq ⚡ ALed API*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq ⚡ ALed Admin*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq ⚡ ALed Frontend*" >nul 2>&1
echo ✅ Старые процессы остановлены
echo.

REM Запуск серверов
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo              🚀 ЗАПУСКАЮ ВСЕ СЕРВЕРЫ...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

timeout /t 2 /nobreak >nul

echo [Запуск 1/3] 🔵 Запускаю Backend API...
start "⚡ ALed API - НЕ ЗАКРЫВАТЬ!" cmd /k "echo. && echo ════════════════════════════════════════ && echo     ALed API Server && echo ════════════════════════════════════════ && echo. && cd demo-api && npm start"
timeout /t 5 /nobreak >nul
echo              ✅ API работает: http://localhost:4000
echo.

echo [Запуск 2/3] 🎨 Запускаю Админ-панель...
start "⚡ ALed Admin - НЕ ЗАКРЫВАТЬ!" cmd /k "echo. && echo ════════════════════════════════════════ && echo     ALed Admin Panel && echo ════════════════════════════════════════ && echo. && cd apps\admin && npm run dev"
timeout /t 5 /nobreak >nul
echo              ✅ Админка работает: http://localhost:3001
echo.

echo [Запуск 3/3] 🛍️ Запускаю Витрину магазина...
start "⚡ ALed Frontend - НЕ ЗАКРЫВАТЬ!" cmd /k "echo. && echo ════════════════════════════════════════ && echo     ALed Store Frontend && echo ════════════════════════════════════════ && echo. && cd apps\frontend && npm run dev"
timeout /t 5 /nobreak >nul
echo              ✅ Витрина работает: http://localhost:3000
echo.

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo                    ✨✨✨ ГОТОВО! ✨✨✨
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo.
echo  📱 Откройте в браузере:
echo.
echo     🛍️ Витрина (Клиенты):
echo        👉 http://localhost:3000
echo.
echo     🎨 Админ-панель:
echo        👉 http://localhost:3001
echo.
echo     📚 API Документация:
echo        👉 http://localhost:4000/docs
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo  🔐 ДАННЫЕ ДЛЯ ВХОДА В АДМИНКУ:
echo.
echo     Email:     admin@aled.local
echo     Пароль:    admin123
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo.
echo  ⚠️  ВАЖНО:
echo.
echo     • Открылось 3 окна (API, Админка, Витрина)
echo     • НЕ ЗАКРЫВАЙТЕ их - они должны работать!
echo     • Это окно можно закрыть
echo.
echo  🛑 Чтобы остановить проект:
echo.
echo     • Запустите ОСТАНОВИТЬ.bat
echo     • Или закройте все 3 черных окна
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo.
pause

