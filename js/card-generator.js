/**
 * Генератор случайных раскладов Таро - ОБНОВЛЕННЫЙ для полной колоды
 */

class TarotGenerator {
    constructor() {
        this.cards = []; // Будет загружено из tarot-data.json
        this.loaded = false;
        
        // Локации (остаются без изменений)
        this.locations = [
            {
                name: "Лес Сомнений",
                theme: "forest",
                color: "#3a5d42",
                description: "Место, где тени прошлого переплетаются с возможностями будущего."
            },
            {
                name: "Горы Амбиций",
                theme: "mountains",
                color: "#7a6a5c",
                description: "Высокие вершины целей и глубокие пропасти сомнений."
            },
            {
                name: "Океан Эмоций",
                theme: "ocean",
                color: "#2c5d7a",
                description: "Бездонные глубины чувств и переменчивые течения настроений."
            },
            {
                name: "Пустыня Ожиданий",
                theme: "desert",
                color: "#b58e5c",
                description: "Бескрайние просторы надежд и редкие оазисы реализации."
            },
            {
                name: "Город Возможностей",
                theme: "city",
                color: "#5c4a4a",
                description: "Лабиринт решений, где каждый перекресток — новый выбор."
            }
        ];

        // Артефакты (остаются без изменений)
        this.artifacts = {
            ritual: [
                {
                    title: "Шаг в неведомое",
                    action: "Сделайте сегодня что-то спонтанное, даже если это кажется нелогичным."
                },
                {
                    title: "Очищение мыслей",
                    action: "Выпишите на бумагу все тревожащие мысли, затем сожгите или разорвите её."
                },
                {
                    title: "Бокал благодарности",
                    action: "Вечером вспомните три вещи, за которые вы благодарны сегодня."
                },
                {
                    title: "Искра действия",
                    action: "Сделайте что-то, что зажжёт ваш энтузиазм, даже если это небольшая задача."
                },
                {
                    title: "Заземление",
                    action: "Проведите 10 минут на природе или просто постойте босиком."
                }
            ],
            quote: [
                {
                    text: "«Самый важный шаг — всегда первый»",
                    author: "Неизвестный картограф"
                },
                {
                    text: "«Иногда крушение планов — это не катастрофа, а освобождение»",
                    author: "Мудрец Башни"
                },
                {
                    text: "«Эмоции — это компас, а не якорь»",
                    author: "Хранительница Чувств"
                },
                {
                    text: "«Действие порождает энергию, энергия порождает действие»",
                    author: "Мастер Жезлов"
                },
                {
                    text: "«Настоящая сила — в мягкости, которая не ломает, а направляет»",
                    author: "Хранительница леса"
                }
            ],
            idea: [
                "Сегодня посмотрите на привычную ситуацию с неожиданного ракурса.",
                "Перед принятием решения спросите: «Что подсказывает разум, а что — сердце?»",
                "Обратите внимание на маленькие, практичные шаги — они ведут к большим результатам.",
                "Попробуйте непривычный маршрут или способ сделать обычное дело.",
                "Уделите 15 минут тишине сегодня, без телефона и других отвлекающих факторов."
            ]
        };

        // Позиции в раскладе (остаются без изменений)
        this.positions = [
            { 
                name: "Локация",
                description: "Основная тема дня",
                icon: "📍"
            },
            { 
                name: "Вызов", 
                description: "Что требует внимания и преодоления",
                icon: "⚔️"
            },
            { 
                name: "Совет", 
                description: "Как лучше всего действовать",
                icon: "💡"
            },
            { 
                name: "Сюрприз", 
                description: "Неожиданный поворот или подарок судьбы",
                icon: "🎁"
            },
            { 
                name: "Итог", 
                description: "К чему приведет сегодняшний день",
                icon: "🏆"
            }
        ];
    }

    // Метод для получения пути к изображению карты
    getCardImagePath(cardId) {
        // Сопоставление ID карт с именами файлов
        const cardFileMap = {
            'fool': '00-fool.jpg',
            'magician': '01-magician.jpg',
            'high_priestess': '02-high_priestess.jpg',
            'empress': '03-empress.jpg',
            'emperor': '04-emperor.jpg',
            'hierophant': '05-hierophant.jpg',
            'lovers': '06-lovers.jpg',
            'chariot': '07-chariot.jpg',
            'strength': '08-strength.jpg',
            'hermit': '09-hermit.jpg',
            'wheel_of_fortune': '10-wheel_of_fortune.jpg',
            'justice': '11-justice.jpg',
            'hanged_man': '12-hanged_man.jpg',
            'death': '13-death.jpg',
            'temperance': '14-temperance.jpg',
            'devil': '15-devil.jpg',
            'tower': '16-tower.jpg',
            'star': '17-star.jpg',
            'moon': '18-moon.jpg',
            'sun': '19-sun.jpg',
            'judgement': '20-judgement.jpg',
            'world': '21-world.jpg'
        };
        
        return cardFileMap[cardId] || 'back.png';
    }

    // Загрузка данных из JSON файла
    async loadData() {
        if (this.loaded) return;
        
        try {
            const response = await fetch('data/tarot-data.json');
            this.cards = await response.json();
            this.loaded = true;
            console.log(`✅ Загружено ${this.cards.length} карт Таро (полная колода)`);
        } catch (error) {
            console.error('❌ Ошибка загрузки данных карт:', error);
            // Используем fallback данные
            await this.loadFallbackData();
        }
    }
    
    // Fallback данные на случай ошибки загрузки
    async loadFallbackData() {
        console.log("Использую fallback данные...");
        // Здесь можно оставить старые данные или минимальный набор
        // Для простоты используем только старшие арканы
        this.cards = [];
        const majorCards = [
            "fool", "magician", "high_priestess", "empress", "emperor",
            "hierophant", "lovers", "chariot", "strength", "hermit",
            "wheel_of_fortune", "justice", "hanged_man", "death", "temperance",
            "devil", "tower", "star", "moon", "sun", "judgement", "world"
        ];
        
        majorCards.forEach((id, index) => {
            this.cards.push({
                id: id,
                name: id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                number: index.toString(),
                type: "major",
                meaning: "Значение карты " + id,
                reversed: "Обратное значение " + id
            });
        });
        
        this.loaded = true;
    }

    // Генерация ID пользователя
    generateUserId() {
        let userId = localStorage.getItem('tarot_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('tarot_user_id', userId);
        }
        return userId;
    }

    // Хэш-алгоритм для детерминированной случайности
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Генерация дневного расклада
    async generateDailySpread() {
        // Убедимся, что данные загружены
        if (!this.loaded) {
            await this.loadData();
        }
        
        const userId = this.generateUserId();
        const today = new Date();
        const dateStr = today.toDateString();
        
        // Создаем уникальный seed на основе даты и ID пользователя
        const seedStr = dateStr + userId;
        let seed = this.hashString(seedStr);
        
        console.log(`🎴 Генерация расклада на ${dateStr} (${this.cards.length} карт в колоде)...`);
        
        // Выбираем случайную локацию
        const locationSeed = (seed * 13) % this.locations.length;
        const location = { ...this.locations[locationSeed] };
        
        // Генерируем расклад из 5 карт
        const spread = [];
        const usedCardIndices = new Set(); // Для избегания дублирования карт
        
        for (let i = 0; i < 5; i++) {
            // Генерируем "случайное" число на основе seed и позиции
            let cardSeed = (seed + i * 17) % 100000;
            let attempts = 0;
            let cardIndex;
            
            // Ищем уникальную карту (максимум 10 попыток)
            do {
                cardIndex = (cardSeed + attempts * 7) % this.cards.length;
                cardSeed = this.hashString(cardSeed.toString() + attempts);
                attempts++;
            } while (usedCardIndices.has(cardIndex) && attempts < 10);
            
            usedCardIndices.add(cardIndex);
            
            const baseCard = { ...this.cards[cardIndex] };
            
            // Определяем, перевернута ли карта (30% шанс)
            const isReversed = (cardSeed % 100) < 30;
            
            // Выбираем артефакт в зависимости от позиции
            let artifactType;
            let artifact;

            switch(i) {
                case 0: // Локация
                    artifactType = 'ritual';
                    break;
                case 1: // Вызов
                    artifactType = 'ritual';
                    break;
                case 2: // Совет - ИДЕЯ
                    artifactType = 'idea';
                    break;
                case 3: // Сюрприз
                    artifactType = 'quote';
                    break;
                case 4: // Итог
                    artifactType = 'ritual';
                    break;
                default:
                    artifactType = 'ritual';
            }

            const artifactList = this.artifacts[artifactType];
            const artifactIndex = cardSeed % artifactList.length;
            const selectedArtifact = artifactList[artifactIndex];

            // Формируем artifact в зависимости от типа
            if (artifactType === 'idea') {
                // Для идей: artifactList содержит строки
                artifact = { 
                    type: 'idea',
                    idea: selectedArtifact // selectedArtifact - это строка
                };
            } else if (artifactType === 'quote') {
                // Для цитат: selectedArtifact - это объект {text, author}
                artifact = { 
                    type: 'quote',
                    text: selectedArtifact.text,
                    author: selectedArtifact.author
                };
            } else {
                // Для ритуалов: selectedArtifact - это объект {title, action}
                artifact = { 
                    type: 'ritual',
                    title: selectedArtifact.title,
                    action: selectedArtifact.action
                };
            }
            
            // Получаем позицию
            const position = this.positions[i];
            
            // Создаем финальную карту
            const card = {
                id: baseCard.id,
                name: baseCard.name_ru || baseCard.name,
                originalName: baseCard.name,
                number: baseCard.number,
                type: baseCard.type,
                suit: baseCard.suit_ru || baseCard.suit,
                originalSuit: baseCard.suit,
                position: position.name,
                positionIcon: position.icon,
                positionDescription: position.description,
                meaning: isReversed ? baseCard.reversed : baseCard.meaning,
                originalMeaning: baseCard.meaning,
                originalReversed: baseCard.reversed,
                isReversed: isReversed,
                artifact: artifact,
                // Путь к изображению карты
                imagePath: `images/cards/${this.getCardImagePath(baseCard.id)}`,
                // Для отображения в интерфейсе
                displayMeaning: this.getDisplayMeaning(baseCard, position, isReversed),
                suitDisplay: this.getSuitDisplay(baseCard)
            };
            
            spread.push(card);
            
            // Обновляем seed для следующей карты
            seed = this.hashString(seed.toString() + i);
        }
        
        console.log("✅ Расклад сгенерирован:", spread.map(c => {
            const artifactInfo = c.artifact.type === 'idea' ? 
                `[${c.artifact.type}: "${c.artifact.idea?.substring(0, 20)}..."]` : 
                `[${c.artifact.type}]`;
            return `${c.name}${c.isReversed ? ' (R)' : ''} ${artifactInfo}`;
        }));
        
        return {
            date: dateStr,
            location: location,
            spread: spread,
            userId: userId
        };
    }

    getDisplayMeaning(baseCard, position, isReversed) {
        const baseMeaning = isReversed ? baseCard.reversed : baseCard.meaning;
        
        const positionContexts = {
            "Локация": `Это задает тон вашему дню: ${baseMeaning.toLowerCase()}`,
            "Вызов": `Сегодня вам предстоит столкнуться с: ${baseMeaning.toLowerCase()}`,
            "Совет": `Лучший способ действий: ${baseMeaning.toLowerCase()}`,
            "Сюрприз": `Неожиданно проявится: ${baseMeaning.toLowerCase()}`,
            "Итог": `К концу дня вы придете к: ${baseMeaning.toLowerCase()}`
        };
        
        const context = positionContexts[position.name] || baseMeaning;
        
        if (isReversed) {
            return `${context} (Карта перевернута — возможно сопротивление или обратное проявление энергии.)`;
        }
        
        return context;
    }
    
    getSuitDisplay(card) {
        if (card.type === 'major') {
            return `${card.number} • Старший Аркан`;
        } else if (card.suit) {
            const suitNames = {
                'wands': 'Жезлы',
                'cups': 'Кубки', 
                'swords': 'Мечи',
                'pentacles': 'Пентакли'
            };
            const suitName = suitNames[card.suit] || card.suit;
            return `${card.number} • ${suitName}`;
        }
        return card.number || '';
    }

    // Метод для генерации расклада по типу карт (только старшие, только определенная масть и т.д.)
    async generateFilteredSpread(filter = 'all') {
        await this.loadData();
        
        let filteredCards = [...this.cards];
        
        switch(filter) {
            case 'major':
                filteredCards = this.cards.filter(card => card.type === 'major');
                break;
            case 'minor':
                filteredCards = this.cards.filter(card => card.type === 'minor');
                break;
            case 'wands':
                filteredCards = this.cards.filter(card => card.suit === 'wands');
                break;
            case 'cups':
                filteredCards = this.cards.filter(card => card.suit === 'cups');
                break;
            case 'swords':
                filteredCards = this.cards.filter(card => card.suit === 'swords');
                break;
            case 'pentacles':
                filteredCards = this.cards.filter(card => card.suit === 'pentacles');
                break;
        }
        
        if (filteredCards.length === 0) {
            filteredCards = this.cards; // Fallback на все карты
        }
        
        // Используем ту же логику, что и в generateDailySpread, но с отфильтрованными картами
        const tempCards = this.cards;
        this.cards = filteredCards;
        const spread = await this.generateDailySpread();
        this.cards = tempCards;
        
        return spread;
    }

    // Метод для получения карты по ID
    getCardById(id) {
        return this.cards.find(card => card.id === id);
    }

    // Метод для получения карт по масти
    getCardsBySuit(suit) {
        return this.cards.filter(card => card.suit === suit);
    }

    // Метод для получения карт по типу
    getCardsByType(type) {
        return this.cards.filter(card => card.type === type);
    }
}

// Экспорт для использования в браузере
if (typeof window !== 'undefined') {
    window.TarotGenerator = TarotGenerator;
}