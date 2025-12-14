/**
 * Tarot Journey - ПОЛНАЯ ВЕРСИЯ с генерацией карт
 */

console.log("=== TAROT JOURNEY v2.0 START ===");

// Главный класс приложения
class TarotJourney {
    constructor() {
        this.generator = new TarotGenerator();
        this.currentJourney = null;
        this.userJourneys = this.loadJourneyHistory();
        console.log("Создаю приложение...");
        this.init();
    }
    
    init() {
        console.log("Инициализация...");
        
        // Генерируем или загружаем сегодняшний расклад
        this.loadOrGenerateJourney();
        
        // Скрываем экран загрузки через 1 секунду
        setTimeout(() => {
            this.hideLoadingScreen();
            this.setupEventListeners();
            this.updateMainScreen();
            console.log("Приложение готово!");
        }, 1000);
    }
    
    loadOrGenerateJourney() {
        const today = new Date().toDateString();
        
        // Проверяем, есть ли сохраненный расклад на сегодня
        const savedJourney = localStorage.getItem('tarot_current_journey');
        if (savedJourney) {
            try {
                const journey = JSON.parse(savedJourney);
                if (journey.date === today) {
                    this.currentJourney = journey;
                    console.log("✅ Загружен сохраненный расклад на сегодня");
                    return;
                }
            } catch (e) {
                console.log("Ошибка загрузки сохраненного расклада:", e);
            }
        }
        
        // Генерируем новый расклад
        this.currentJourney = this.generator.generateDailySpread();
        
        // Сохраняем
        localStorage.setItem('tarot_current_journey', JSON.stringify(this.currentJourney));
        console.log("✅ Сгенерирован новый расклад на сегодня");
    }
    
    loadJourneyHistory() {
        const history = localStorage.getItem('tarot_journey_history');
        return history ? JSON.parse(history) : [];
    }
    
    saveJourneyHistory() {
        if (this.currentJourney && !this.userJourneys.some(j => j.date === this.currentJourney.date)) {
            this.userJourneys.push({
                date: this.currentJourney.date,
                location: this.currentJourney.location.name,
                cards: this.currentJourney.spread.map(c => c.name)
            });
            
            // Оставляем только последние 30 дней
            if (this.userJourneys.length > 30) {
                this.userJourneys = this.userJourneys.slice(-30);
            }
            
            localStorage.setItem('tarot_journey_history', JSON.stringify(this.userJourneys));
        }
    }
    
    hideLoadingScreen() {
        const loading = document.getElementById('loading-screen');
        const main = document.getElementById('main-screen');
        
        if (loading) {
            loading.classList.add('hidden');
            console.log("Экран загрузки скрыт");
        }
        
        if (main) {
            main.classList.remove('hidden');
            console.log("Главный экран показан");
        }
    }
    
    updateMainScreen() {
        if (!this.currentJourney) return;
        
        // Обновляем информацию о сегодняшней локации
        const dailyLocation = document.getElementById('daily-location');
        const locationDesc = document.getElementById('location-desc');
        
        if (dailyLocation) {
            dailyLocation.textContent = this.currentJourney.location.name;
        }
        
        if (locationDesc) {
            locationDesc.textContent = this.currentJourney.location.description;
        }
        
        // Обновляем счетчик путешествий
        const coins = this.userJourneys.length * 3;
        document.getElementById('user-coins').textContent = `⚪ ${coins}`;
    }
    
    setupEventListeners() {
        console.log("Настраиваю обработчики...");
        
        // 1. Кнопка БЕСПЛАТНОГО ПРЕДПРОСМОТРА
        this.setupButton('trial-btn', () => {
            console.log(">>> Нажата кнопка 'Бесплатный предпросмотр'");
            this.showJourney();
        });
        
        // 2. Кнопка НАЗАД из путешествия
        this.setupButton('back-to-main', () => {
            console.log("Нажата кнопка 'Назад'");
            this.showMain();
        });
        
        // 3. Кнопка "К карте" из карты
        this.setupButton('back-to-map', () => {
            console.log("Нажата кнопка 'К карте'");
            this.showJourney();
        });
        
        // 4. Кнопка "Продолжить путешествие"
        this.setupButton('continue-journey', () => {
            console.log("Нажата кнопка 'Продолжить путешествие'");
            this.showJourney();
        });
        
        // 5. Кнопки покупки
        this.setupButton('buy-single', () => {
            alert("Демо: Одно путешествие - 99 ₽\n\nВ реальной версии здесь будет интеграция с платежной системой.");
        });
        
        this.setupButton('buy-weekly', () => {
            alert("Демо: Пакет 'Исследователь' - 399 ₽\n\n5 путешествий на неделю + бонусные артефакты.");
        });
        
        // 6. Клик по карте
        const mapCanvas = document.getElementById('journey-map');
        if (mapCanvas) {
            mapCanvas.addEventListener('click', (e) => {
                // Получаем координаты клика
                const rect = mapCanvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Определяем, в какую зону кликнули
                const cardIndex = this.getCardIndexFromClick(x, y, mapCanvas.width, mapCanvas.height);
                
                console.log(`Клик по карте в зону ${cardIndex}`);
                this.showCard(cardIndex);
            });
            console.log("Canvas 'journey-map' подключен");
        } else {
            console.error("❌ Canvas 'journey-map' НЕ НАЙДЕН!");
        }
        
        // 7. Меню
        this.setupButton('menu-btn', () => {
            document.getElementById('side-menu')?.classList.add('active');
            document.getElementById('menu-overlay')?.classList.add('active');
            this.updateMenuHistory();
        });
        
        this.setupButton('close-menu', () => {
            document.getElementById('side-menu')?.classList.remove('active');
            document.getElementById('menu-overlay')?.classList.remove('active');
        });
        
        // 8. Кнопки финального экрана
        this.setupButton('new-journey-btn', () => {
            this.showMain();
        });
        
        this.setupButton('share-btn', () => {
            alert("В реальной версии здесь будет возможность поделиться картой в соцсетях.");
        });
        
        this.setupButton('save-btn', () => {
            this.saveFinalMap();
        });
        
        console.log("✅ Все обработчики настроены");
    }
    
    setupButton(buttonId, handler) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', handler);
            console.log(`Кнопка '${buttonId}' подключена`);
        } else {
            console.error(`❌ Кнопка '${buttonId}' НЕ НАЙДЕНА!`);
        }
    }
    
    updateMenuHistory() {
        const historyContainer = document.getElementById('journey-history');
        if (!historyContainer) return;
        
        historyContainer.innerHTML = '';
        
        this.userJourneys.slice(-5).reverse().forEach(journey => {
            const item = document.createElement('div');
            item.className = 'journey-history-item';
            item.innerHTML = `
                <div class="journey-history-date">${journey.date}</div>
                <div class="journey-history-location">${journey.location}</div>
                <div class="journey-history-cards">${journey.cards.length} карт</div>
            `;
            historyContainer.appendChild(item);
        });
    }
    
    getCardIndexFromClick(x, y, width, height) {
        if (!this.currentJourney) return 0;
        
        // Координаты центров кругов
        const circles = [
            { x: width / 2, y: height / 2, radius: 60 },      // Центр - позиция 0 (Локация)
            { x: width * 0.2, y: height * 0.3, radius: 40 },  // Левый верх - позиция 1 (Вызов)
            { x: width * 0.8, y: height * 0.4, radius: 40 },  // Правый верх - позиция 2 (Совет)
            { x: width * 0.4, y: height * 0.7, radius: 40 },  // Левый низ - позиция 3 (Сюрприз)
            { x: width * 0.6, y: height * 0.8, radius: 40 }   // Правый низ - позиция 4 (Итог)
        ];
        
        // Проверяем каждый круг
        for (let i = 0; i < circles.length; i++) {
            const circle = circles[i];
            const distance = Math.sqrt(
                Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2)
            );
            
            // Если клик внутри круга + небольшой запас
            if (distance <= circle.radius * 1.2) {
                console.log(`Клик в круг #${i} (${this.currentJourney.spread[i]?.position})`);
                return i;
            }
        }
        
        // Если клик не в круге, возвращаем первую карту
        console.log("Клик не в круге, возвращаем карту 0");
        return 0;
    }
    
    showJourney() {
        console.log("Показываю экран путешествия...");
        
        if (!this.currentJourney) {
            console.error("Нет текущего путешествия!");
            return;
        }
        
        // Скрываем все другие экраны
        this.hideAllScreens();
        
        // Показываем экран путешествия
        const journeyScreen = document.getElementById('journey-screen');
        if (journeyScreen) {
            journeyScreen.classList.remove('hidden');
            console.log("Показал journey-screen");
            
            // Обновляем название локации
            document.getElementById('journey-location-name').textContent = this.currentJourney.location.name;
            
            // Создаем карту
            setTimeout(() => this.createMap(), 50);
        }
    }
    
    showMain() {
        console.log("Показываю главный экран...");
        this.hideAllScreens();
        document.getElementById('welcome-section')?.classList.remove('hidden');
        this.updateMainScreen();
    }
    
    showCard(cardIndex = 0) {
        console.log(`Показываю карту #${cardIndex}...`);
        
        if (!this.currentJourney || !this.currentJourney.spread[cardIndex]) {
            console.error("Карта не найдена!");
            return;
        }
        
        const card = this.currentJourney.spread[cardIndex];
        
        // Отладочная информация
        console.log('Информация о карте:', {
            id: card.id,
            name: card.name,
            imagePath: card.imagePath,
            artifact: card.artifact
        });
        
        // Заполняем данные карты
        document.getElementById('card-position').textContent = card.position;
        document.getElementById('card-name').textContent = card.name;
        document.getElementById('card-suit').textContent = card.suitDisplay || card.suit;
        document.getElementById('card-meaning').textContent = card.displayMeaning;
        
        // ОТОБРАЖАЕМ ИЗОБРАЖЕНИЕ КАРТЫ
        const cardImageElement = document.getElementById('card-image');
        if (cardImageElement) {
            // Очищаем предыдущее содержимое
            cardImageElement.innerHTML = '';
            
            // Создаем элемент изображения
            const img = document.createElement('img');
            
            // Используем путь к изображению из объекта карты
            let imagePath = card.imagePath;
            if (!imagePath && card.id) {
                // Формируем путь на основе ID карты
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
                const filename = cardFileMap[card.id] || 'placeholder.png';
                imagePath = `images/cards/${filename}`;
            }
            
            img.src = imagePath || 'images/cards/placeholder.png';
            img.alt = card.name;
            img.className = 'tarot-card-image';
            
            // Если карта перевернута, добавляем класс
            if (card.isReversed) {
                img.classList.add('reversed');
            }
            
            // Добавляем стили для правильного отображения
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.style.borderRadius = 'var(--border-radius-sm)';
            
            // Если изображение не загрузится, покажем заглушку
            img.onerror = function() {
                console.warn(`Изображение не найдено: ${imagePath}`);
                this.src = 'images/cards/placeholder.png';
                this.onerror = null; // Предотвращаем бесконечный цикл
            };
            
            // Добавляем обработчик успешной загрузки
            img.onload = function() {
                console.log(`✅ Изображение загружено: ${imagePath}`);
            };
            
            cardImageElement.appendChild(img);
            console.log(`Пытаюсь загрузить изображение: ${imagePath}`);
        }
        
        // Показываем индикатор реверса
        const reversedElement = document.getElementById('card-reversed');
        if (reversedElement) {
            if (card.isReversed) {
                reversedElement.classList.remove('hidden');
                document.getElementById('reversed-meaning').textContent = "Карта перевернута - энергия может проявляться иначе.";
            } else {
                reversedElement.classList.add('hidden');
            }
        }
        
        // Отображаем артефакт (ИСПРАВЛЕНО для идей)
        let artifactHTML = '';
        if (card.artifact.type === 'ritual') {
            artifactHTML = `
                <div class="artifact-ritual">
                    <div class="artifact-header">
                        <span class="artifact-icon">🔮</span>
                        <h6>${card.artifact.title || 'Ритуал дня'}</h6>
                    </div>
                    <p>${card.artifact.action || ''}</p>
                </div>
            `;
        } else if (card.artifact.type === 'idea') {
            artifactHTML = `
                <div class="artifact-idea">
                    <div class="artifact-header">
                        <span class="artifact-icon">💡</span>
                        <h6>Идея дня</h6>
                    </div>
                    <p>${card.artifact.idea || ''}</p>
                </div>
            `;
        } else if (card.artifact.type === 'quote') {
            artifactHTML = `
                <div class="artifact-quote">
                    <div class="artifact-header">
                        <span class="artifact-icon">📜</span>
                        <h6>Цитата путешественника</h6>
                    </div>
                    <blockquote>"${card.artifact.text || ''}"</blockquote>
                    <cite>— ${card.artifact.author || 'Автор'}</cite>
                </div>
            `;
        } else {
            // Запасной вариант
            artifactHTML = `
                <div class="artifact-idea">
                    <div class="artifact-header">
                        <span class="artifact-icon">💡</span>
                        <h6>Артефакт</h6>
                    </div>
                    <p>${JSON.stringify(card.artifact)}</p>
                </div>
            `;
        }
        
        document.getElementById('artifact-content').innerHTML = artifactHTML;
        
        // Показываем экран карты
        this.hideAllScreens();
        document.getElementById('card-reveal-screen').classList.remove('hidden');
        
        console.log(`✅ Карта "${card.name}" показана!`);
        
        // Сохраняем в историю
        this.saveJourneyHistory();
    }
    
    hideAllScreens() {
        // Все основные экраны
        const screens = [
            'welcome-section',
            'journey-screen',
            'card-reveal-screen',
            'final-map-screen'
        ];
        
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) screen.classList.add('hidden');
        });
        
        console.log("Все экраны скрыты");
    }
    
    createMap() {
        console.log("Создаю карту...");
        
        const canvas = document.getElementById('journey-map');
        if (!canvas) {
            console.error("❌ Canvas не найден!");
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("❌ Контекст canvas не получен!");
            return;
        }
        
        // Устанавливаем размеры canvas
        const container = canvas.parentElement;
        const width = canvas.width = container.clientWidth;
        const height = canvas.height = container.clientHeight;
        
        console.log("Размеры canvas:", width, "x", height);
        
        // Очищаем canvas
        ctx.clearRect(0, 0, width, height);
        
        if (!this.currentJourney) return;
        
        // 1. Фон - цвет локации
        ctx.fillStyle = this.currentJourney.location.color;
        ctx.fillRect(0, 0, width, height);
        
        // 2. Центральный БОЛЬШОЙ круг (открытая локация - карта 0)
        if (this.currentJourney.spread[0]) {
            const firstCard = this.currentJourney.spread[0];
            const shortName = firstCard.name.length > 8 ? 
                firstCard.name.substring(0, 6) + ".." : 
                firstCard.name;
            this.drawCircle(ctx, width / 2, height / 2, 60, true, firstCard.positionIcon, shortName);
        }
        
        // 3. 4 маленьких круга (скрытые карты 1-4)
        const circles = [
            { x: width * 0.2, y: height * 0.3, cardIndex: 1 },  // Вызов
            { x: width * 0.8, y: height * 0.4, cardIndex: 2 },  // Совет
            { x: width * 0.4, y: height * 0.7, cardIndex: 3 },  // Сюрприз
            { x: width * 0.6, y: height * 0.8, cardIndex: 4 }   // Итог
        ];
        
        circles.forEach((circle) => {
            if (this.currentJourney.spread[circle.cardIndex]) {
                const card = this.currentJourney.spread[circle.cardIndex];
                const label = card.position;
                
                this.drawCircle(ctx, circle.x, circle.y, 40, false, "?", label);
            }
        });
        
        // 4. Компас в правом верхнем углу
        this.drawCompass(ctx, width - 50, 50);
        
        console.log("✅ Карта создана!");
    }
    
    drawCircle(ctx, x, y, radius, isOpen, symbol, label) {
        // Внешнее свечение для открытых кругов
        if (isOpen) {
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.5);
            gradient.addColorStop(0, "rgba(201, 169, 110, 0.6)");
            gradient.addColorStop(1, "transparent");
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Основной круг
        ctx.fillStyle = isOpen ? "#f5e9d4" : "rgba(44, 24, 16, 0.7)";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Обводка
        ctx.strokeStyle = isOpen ? "#c9a96e" : "rgba(44, 24, 16, 0.9)";
        ctx.lineWidth = isOpen ? 3 : 2;
        if (!isOpen) ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Символ
        ctx.fillStyle = isOpen ? "#2c1810" : "rgba(245, 233, 212, 0.7)";
        ctx.font = isOpen ? "bold 24px Arial, sans-serif" : "bold 20px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(symbol, x, y);
        
        // Метка под кругом
        if (label) {
            ctx.font = "12px Arial, sans-serif";
            ctx.fillStyle = isOpen ? "#4a3329" : "rgba(245, 233, 212, 0.5)";
            
            // Обрезаем длинные названия
            const shortLabel = label.length > 10 ? label.substring(0, 8) + ".." : label;
            ctx.fillText(shortLabel, x, y + radius + 15);
        }
    }
    
    drawCompass(ctx, x, y) {
        // Внешний круг
        ctx.strokeStyle = "#c9a96e";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.stroke();
        
        // Внутренний круг
        ctx.fillStyle = "#f5e9d4";
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();
        
        // Стрелка
        ctx.fillStyle = "#2c1810";
        ctx.beginPath();
        ctx.moveTo(x, y - 12);
        ctx.lineTo(x - 6, y + 8);
        ctx.lineTo(x + 6, y + 8);
        ctx.closePath();
        ctx.fill();
    }
    
    saveFinalMap() {
        const canvas = document.getElementById('journey-map');
        if (!canvas) return;
        
        const link = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        link.download = `tarot-journey-${date}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        alert("Карта сохранена! Проверьте папку 'Загрузки'.");
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM загружен, запускаю приложение...");
    window.tarotApp = new TarotJourney();
});

// Команды для отладки в консоли браузера
window.debug = {
    showJourney: () => window.tarotApp?.showJourney(),
    showMain: () => window.tarotApp?.showMain(),
    showCard: (index) => window.tarotApp?.showCard(index),
    createMap: () => window.tarotApp?.createMap(),
    newJourney: () => {
        localStorage.removeItem('tarot_current_journey');
        location.reload();
    },
    getCurrentJourney: () => window.tarotApp?.currentJourney
};