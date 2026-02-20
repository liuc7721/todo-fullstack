@echo off
chcp 65001 >nul
echo ============================================
echo   請先「完全關閉 Cursor」再按任意鍵繼續
echo ============================================
pause >nul
cd /d "%~dp0"
python merge_cursor_state.py
echo.
echo 完成後請重新開啟 Cursor。
pause
