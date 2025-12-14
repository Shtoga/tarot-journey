/**
 * Класс для работы с колодой Таро
 */

class TarotDeck {
    constructor() {
        this.cards = [];
        this.loaded = false;
    }
    
    async loadData() {
        if (this.loaded) return;
        
        try {
            const response = await fetch('data/tarot-data.json');
            this.cards = await response.json();
            this.loaded = true;
            console.log(`Загружено ${this.cards.length} карт Таро`);
        } catch (error) {
            console.error('Ошибка загрузки данных карт:', error);
            throw error;
        }
    }
    
    generateDailySpread(userId) {
        if (!this.loaded) {
            throw new Error('Данные карт не загружены');
        }
        
        // Создаем детерминированный сид на основе даты и ID пользователя
        const dateStr = new Date().toDateString();
        const seedStr = dateStr + userId;
        const seed = this.hashString(seedStr);
        
        const positions = [
            { name: 'Локация', desc: 'Основная тема дня' },
            { name: 'Вызов', desc: 'Что требует внимания' },
            { name: 'Совет', desc: 'Как действовать' },
            { name: 'Сюрприз', desc: 'Неожиданный поворот' },
            { name: 'Итог', desc: 'Результат дня' }
        ];
        
        const spread = [];
        
        for (let i = 0; i < 5; i++) {
            // Генерируем индекс карты на основе сида и позиции
            const cardIndex = (seed + i * 13) % this.cards.length;
            const card = { ...this.cards[cardIndex] };
            
            // Определяем реверс (33% вероятность)
            const reverseSeed = (seed + i * 7) % 3;
            card.isReversed = reverseSeed === 0;
            
            // Добавляем позицию
            card.position = positions[i];
            
            spread.push(card);
        }
        
        return spread;
    }
    
    getCardById(id) {
        return this.cards.find(card => card.id === id);
    }
    
    getCardByName(name) {
        return this.cards.find(card => 
            card.name.toLowerCase() === name.toLowerCase() ||
            card.name_ru.toLowerCase() === name.toLowerCase()
        );
    }
    
    getCardsBySuit(suit) {
        return this.cards.filter(card => card.suit === suit);
    }
    
    getMajorArcana() {
        return this.cards.filter(card => card.type === 'major');
    }
    
    getMinorArcana() {
        return this.cards.filter(card => card.type === 'minor');
    }
    
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
    
    // Метод для генерации случайной карты (для тестов)
    drawRandomCard() {
        const index = Math.floor(Math.random() * this.cards.length);
        const card = { ...this.cards[index] };
        card.isReversed = Math.random() < 0.33;
        return card;
    }
    
    // Метод для генерации расклада по конкретному запросу
    generateCustomSpread(question, positionsCount = 3) {
        if (!this.loaded) {
            throw new Error('Данные карт не загружены');
        }
        
        const seed = this.hashString(question + Date.now());
        const spread = [];
        
        for (let i = 0; i < positionsCount; i++) {
            const cardIndex = (seed + i * 17) % this.cards.length;
            const card = { ...this.cards[cardIndex] };
            card.isReversed = ((seed + i * 11) % 3) === 0;
            
            // Добавляем позицию
            const positionTypes = ['Прошлое', 'Настоящее', 'Будущее', 'Совет', 'Препятствие', 'Результат'];
            card.position = {
                name: positionTypes[i % positionTypes.length],
                desc: `Позиция ${i + 1} в раскладе`
            };
            
            spread.push(card);
        }
        
        return spread;
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TarotDeck;
}