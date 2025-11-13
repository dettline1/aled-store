@echo off
chcp 65001 >nul
cls

echo.
echo    ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡
echo.
echo              ALed Store - ЗАПУСК ПРОЕКТА
echo.
echo    ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡
echo.
echo.

REM Проверка наличия Node.js
echo [Проверка] Проверяю Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ ОШИБКА: Node.js не установлен!
    echo.
    echo 📥 Скачайте Node.js с https://nodejs.org/
    echo    Установите и запустите этот файл снова.
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js установлен
echo.

REM Проверка наличия папки demo-api
if not exist "demo-api" (
    echo.
    echo ❌ ОШИБКА: Папка demo-api не найдена!
    echo.
    echo Убедитесь, что вы запускаете файл из корня проекта.
    echo.
    pause
    exit /b 1
)

REM Проверка зависимостей demo-api
echo [1/3] Проверяю зависимости API...
if not exist "demo-api\node_modules" (
    echo.
    echo 📦 Устанавливаю зависимости для API...
    cd demo-api
    call npm install
    cd ..
    echo ✅ Зависимости API установлены
) else (
    echo ✅ Зависимости API уже установлены
)
echo.

REM Проверка зависимостей admin
echo [2/3] Проверяю зависимости Админки...
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

REM Остановка старых процессов
echo [Очистка] Останавливаю старые процессы...
taskkill /F /FI "WINDOWTITLE eq ⚡ ALed API*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq ⚡ ALed Admin*" >nul 2>&1
echo ✅ Старые процессы остановлены
echo.

REM Запуск серверов
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo              🚀 ЗАПУСКАЮ СЕРВЕРЫ...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

timeout /t 2 /nobreak >nul

echo [Запуск 1/2] 🔵 Запускаю Backend API...
start "⚡ ALed API - НЕ ЗАКРЫВАТЬ!" cmd /k "echo. && echo ════════════════════════════════════════ && echo     ALed API Server && echo ════════════════════════════════════════ && echo. && cd demo-api && npm start"
timeout /t 5 /nobreak >nul
echo              ✅ API работает: http://localhost:4000
echo.

echo [Запуск 2/2] 🎨 Запускаю Админ-панель...
start "⚡ ALed Admin - НЕ ЗАКРЫВАТЬ!" cmd /k "echo. && echo ════════════════════════════════════════ && echo     ALed Admin Panel && echo ════════════════════════════════════════ && echo. && cd apps\admin && npm run dev"
timeout /t 5 /nobreak >nul
echo              ✅ Админка работает: http://localhost:3001
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
echo     🎨 Админ-панель:
echo        👉 http://localhost:3001
echo.
echo     📚 API Документация:
echo        👉 http://localhost:4000/docs
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo  🔐 ДАННЫЕ ДЛЯ ВХОДА:
echo.
echo     Email:     admin@aled.local
echo     Пароль:    admin123
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo.
echo  ⚠️  ВАЖНО:
echo.
echo     • Открылось 2 окна (API и Админка)
echo     • НЕ ЗАКРЫВАЙТЕ их - они должны работать!
echo     • Это окно можно закрыть
echo.
echo  🛑 Чтобы остановить проект:
echo.
echo     • Закройте оба черных окна
echo     • Или нажмите Ctrl+C в каждом
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo.
echo  💡 Что дальше?
echo.
echo     1. Откройте http://localhost:3001
echo     2. Войдите (admin@aled.local / admin123)
echo     3. Наслаждайтесь красивой админкой! 🎨
echo.
echo.
pause

