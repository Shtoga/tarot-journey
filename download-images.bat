@echo off
mkdir images\cards
mkdir images\locations
mkdir images\ui
mkdir images\artifacts
mkdir audio
mkdir fonts

powershell -Command "Invoke-WebRequest -Uri 'https://images.unsplash.com/photo-1617870952346-9f7d77cb63e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' -OutFile 'images\cards\back.png'"
:: ... и так для всех файлов

echo Все файлы загружены!
pause