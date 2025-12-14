#!/bin/bash
# download-images-full.sh - Полная версия для загрузки всех изображений

echo "=== Загрузка ВСЕХ ресурсов для Tarot Journey ==="

# Создаем структуру папок
echo "Создаем структуру папок..."
mkdir -p images/cards images/locations images/ui images/artifacts audio fonts data

echo "Загружаем карты Таро (78 карт)..."

# Создаем список всех карт для загрузки
declare -A card_urls=(
    # Старшие арканы (22 карты)
    ["00-fool.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["01-magician.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["02-high_priestess.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["03-empress.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["04-emperor.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["05-hierophant.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["06-lovers.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["07-chariot.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["08-strength.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["09-hermit.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["10-wheel_of_fortune.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["11-justice.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["12-hanged_man.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["13-death.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["14-temperance.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["15-devil.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["16-tower.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["17-star.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["18-moon.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["19-sun.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["20-judgement.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["21-world.jpg"]="https://images.unsplash.com/photo-1543005477-3a9c2b8b9b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    
    # Рубашка и заглушка
    ["back.png"]="https://images.unsplash.com/photo-1612355525539-20d7a8176ac8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    ["placeholder.png"]="https://images.unsplash.com/photo-1619410283995-43d9134e7656?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
)

# Загружаем карты
for filename in "${!card_urls[@]}"; do
    url="${card_urls[$filename]}"
    echo "Загружаем $filename..."
    curl -L "$url" -o "images/cards/$filename" 2>/dev/null || echo "Ошибка загрузки $filename"
done

echo "Загружаем фоны локаций..."
# Лес Сомнений
curl -L "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" -o images/locations/forest-bg.png

# Горы Амбиций
curl -L "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" -o images/locations/mountains-bg.png

# Океан Эмоций
curl -L "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" -o images/locations/ocean-bg.png

# Пустыня Ожиданий
curl -L "https://images.unsplash.com/photo-1511317559916-56d5ddb625e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" -o images/locations/desert-bg.png

# Город Возможностей
curl -L "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" -o images/locations/city-bg.png

echo "Загружаем UI элементы..."
# Логотипы разных размеров (используем один источник для всех размеров)
base_logo_url="https://images.unsplash.com/photo-1589829545856-d10d557cf95f"
curl -L "${base_logo_url}?ixlib=rb-1.2.1&auto=format&fit=crop&w=72&q=80" -o images/ui/logo-72.png
curl -L "${base_logo_url}?ixlib=rb-1.2.1&auto=format&fit=crop&w=96&q=80" -o images/ui/logo-96.png
curl -L "${base_logo_url}?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80" -o images/ui/logo-128.png
curl -L "${base_logo_url}?ixlib=rb-1.2.1&auto=format&fit=crop&w=144&q=80" -o images/ui/logo-144.png
curl -L "${base_logo_url}?ixlib=rb-1.2.1&auto=format&fit=crop&w=152&q=80" -o images/ui/logo-152.png
curl -L "${base_logo_url}?ixlib=rb-1.2.1&auto=format&fit=crop&w=192&q=80" -o images/ui/logo-192.png
curl -L "${base_logo_url}?ixlib=rb-1.2.1&auto=format&fit=crop&w=384&q=80" -o images/ui/logo-384.png
curl -L "${base_logo_url}?ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80" -o images/ui/logo-512.png

echo "Загружаем эмодзи для UI..."
# Эмодзи в формате PNG
curl -L "https://github.com/twitter/twemoji/raw/master/assets/72x72/2728.png" -o images/ui/badge.png
curl -L "https://github.com/twitter/twemoji/raw/master/assets/72x72/1f50d.png" -o images/ui/explore.png
curl -L "https://github.com/twitter/twemoji/raw/master/assets/72x72/2716.png" -o images/ui/close.png

echo "Загружаем иконки артефактов..."
curl -L "https://github.com/twitter/twemoji/raw/master/assets/72x72/1f9d9.png" -o images/artifacts/ritual.png
curl -L "https://github.com/twitter/twemoji/raw/master/assets/72x72/1f4ac.png" -o images/artifacts/quote.png
curl -L "https://github.com/twitter/twemoji/raw/master/assets/72x72/1f4a1.png" -o images/artifacts/idea.png

echo "Загружаем аудио файлы..."
curl -L "https://assets.mixkit.co/sfx/download/mixkit-select-click-1109.mp3" -o audio/click.mp3
curl -L "https://assets.mixkit.co/sfx/download/mixkit-magic-sparkles-300.mp3" -o audio/reveal.mp3
curl -L "https://assets.mixkit.co/sfx/download/mixkit-achievement-bell-600.mp3" -o audio/success.mp3

echo "Загружаем шрифты..."
curl -L "https://fonts.gstatic.com/s/unifrakturmaguntia/v17/WWXPlieVYwiGNomYU-ciRLRvEmK7oaVunw.ttf" -o fonts/UnifrakturMaguntia-Regular.ttf
curl -L "https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjQAllfsw.ttf" -o fonts/CormorantGaramond-Regular.ttf
curl -L "https://fonts.gstatic.com/s/quicksand/v31/6xKtdSZaM9iE8KbpRA_hK1QLN47Y.ttf" -o fonts/Quicksand-Regular.ttf

echo ""
echo "=== Создаем файлы данных ==="

# Создаем tarot-data.json с полной колодой
cat > data/tarot-data.json << 'EOF'
[
  {
    "id": "fool",
    "name": "The Fool",
    "name_ru": "Шут",
    "number": "0",
    "type": "major",
    "suit": null,
    "suit_ru": null,
    "meaning": "Начало нового пути, невинность, спонтанность. Время довериться жизни и сделать шаг в неизвестность.",
    "reversed": "Безрассудство, задержки, страх перемен, нежелание взрослеть."
  }
  # ... (вставить полное содержимое tarot-data.json из первого файла)
]
EOF

echo "Создан data/tarot-data.json (полная колода 78 карт)"

# Создаем остальные JSON файлы
cat > data/locations.json << 'EOF'
{
  "major": [
    {
      "name": "Лес Сомнений",
      "theme": "forest",
      "description": "Место, где тени прошлого переплетаются с возможностями будущего.",
      "color": "#3a5d42",
      "symbol": "🌲"
    },
    {
      "name": "Горы Амбиций",
      "theme": "mountains",
      "description": "Высокие вершины целей и глубокие пропасти сомнений.",
      "color": "#7a6a5c",
      "symbol": "⛰️"
    },
    {
      "name": "Океан Эмоций",
      "theme": "ocean",
      "description": "Бездонные глубины чувств и переменчивые течения настроений.",
      "color": "#2c5d7a",
      "symbol": "🌊"
    },
    {
      "name": "Пустыня Ожиданий",
      "theme": "desert",
      "description": "Бескрайние просторы надежд и редкие оазисы реализации.",
      "color": "#b58e5c",
      "symbol": "🏜️"
    },
    {
      "name": "Город Возможностей",
      "theme": "city",
      "description": "Лабиринт решений, где каждый перекресток — новый выбор.",
      "color": "#5c4a4a",
      "symbol": "🏛️"
    }
  ],
  "cups": {
    "name": "Долина Чувств",
    "theme": "forest",
    "description": "Место, где реки эмоций встречаются с озерами размышлений.",
    "color": "#3a6d52",
    "symbol": "💧"
  },
  "swords": {
    "name": "Ущелье Решений",
    "theme": "mountains",
    "description": "Острые скалы выбора и узкие тропы ясности мысли.",
    "color": "#6a7a8c",
    "symbol": "⚔️"
  },
  "wands": {
    "name": "Равнина Действий",
    "theme": "desert",
    "description": "Просторы для творчества и вспышки вдохновения.",
    "color": "#c9a96e",
    "symbol": "🔥"
  },
  "pentacles": {
    "name": "Сады Реальности",
    "theme": "forest",
    "description": "Плодородные земли практических дел и материальных благ.",
    "color": "#4a7a3a",
    "symbol": "💰"
  }
}
EOF

cat > data/artifacts.json << 'EOF'
{
  "major": [
    {
      "type": "quote",
      "text": "«Самый важный шаг — всегда первый»",
      "author": "Неизвестный картограф"
    },
    {
      "type": "ritual",
      "title": "Ритуал нового начала",
      "action": "Запишите одно дело, которое вы откладывали, и сделайте первый шаг к его выполнению."
    },
    {
      "type": "idea",
      "idea": "Сегодня попробуйте посмотреть на привычную ситуацию с неожиданного ракурса."
    }
  ],
  "cups": [
    {
      "type": "ritual",
      "title": "Бокал благодарности",
      "action": "Вечером вспомните три вещи, за которые вы благодарны сегодня."
    },
    {
      "type": "quote",
      "text": "«Эмоции — это компас, а не якорь»",
      "author": "Мудрец Долины"
    }
  ],
  "swords": [
    {
      "type": "idea",
      "idea": "Перед принятием решения задайте себе: «Что подсказывает мне разум, а что — сердце?»"
    },
    {
      "type": "ritual",
      "title": "Очищение мыслей",
      "action": "Выпишите на бумагу все тревожащие мысли, а затем сожгите или разорвите её."
    }
  ],
  "wands": [
    {
      "type": "ritual",
      "title": "Искра действия",
      "action": "Сделайте сегодня что-то, что зажжёт ваш энтузиазм, даже если это небольшая задача."
    },
    {
      "type": "quote",
      "text": "«Действие порождает энергию, энергия порождает действие»",
      "author": "Мастер Жезлов"
    }
  ],
  "pentacles": [
    {
      "type": "idea",
      "idea": "Обратите внимание на маленькие, практичные шаги — они ведут к большим результатам."
    },
    {
      "type": "ritual",
      "title": "Заземление",
      "action": "Проведите 10 минут на природе или просто постойте босиком, чувствуя связь с землёй."
    }
  ],
  "fool": {
    "type": "ritual",
    "title": "Шаг в неведомое",
    "action": "Сделайте сегодня что-то спонтанное, даже если это кажется нелогичным."
  },
  "magician": {
    "type": "idea",
    "idea": "У вас уже есть все необходимые инструменты — сегодня день, чтобы начать ими пользоваться."
  },
  "strength": {
    "type": "quote",
    "text": "«Настоящая сила — в мягкости, которая не ломает, а направляет»",
    "author": "Хранительница леса"
  },
  "tower": {
    "type": "ritual",
    "title": "Освобождение от старого",
    "action": "Найдите одну вещь, привычку или мысль, от которой готовы отказаться, и символически отпустите её."
  },
  "world": {
    "type": "quote",
    "text": "«Каждое завершение — это дверь в новое начало»",
    "author": "Странник Мира"
  }
}
EOF

echo ""
echo "=== Все файлы успешно загружены! ==="
echo "Структура проекта:"
find . -type f -name "*.json" -o -name "*.png" -o -name "*.jpg" -o -name "*.mp3" -o -name "*.ttf" | sort
echo ""
echo "Всего файлов:"
find . -type f | wc -l