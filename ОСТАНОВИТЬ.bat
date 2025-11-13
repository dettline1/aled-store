@echo off
chcp 65001 >nul
cls

echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo              🛑 ОСТАНОВКА ПРОЕКТА ALed Store
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo.

echo [1/3] Останавливаю API...
taskkill /F /FI "WINDOWTITLE eq ⚡ ALed API*" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ API остановлен
) else (
    echo ℹ️  API не был запущен
)
echo.

echo [2/3] Останавливаю Админ-панель...
taskkill /F /FI "WINDOWTITLE eq ⚡ ALed Admin*" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Админка остановлена
) else (
    echo ℹ️  Админка не была запущена
)
echo.

echo [3/3] Останавливаю Frontend...
taskkill /F /FI "WINDOWTITLE eq ⚡ ALed Frontend*" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Витрина остановлена
) else (
    echo ℹ️  Витрина не была запущена
)
echo.

REM Дополнительная очистка - останавливаем все Node процессы на портах
echo [Дополнительно] Освобождаю порты...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
echo ✅ Порты освобождены
echo.

echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo                  ✅ ВСЁ ОСТАНОВЛЕНО!
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo.
echo Все процессы остановлены, порты освобождены.
echo.
echo Теперь можно запустить проект заново: СТАРТ.bat
echo.
echo.
pause

