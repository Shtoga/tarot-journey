/**
 * Рендерер для создания финальной карты дня
 */

class CardRenderer {
    constructor() {
        this.canvasCache = new Map();
    }
    
    generateFinalMap(canvasElement, spread, discoveredCards, location) {
        const canvas = canvasElement;
        const ctx = canvas.getContext('2d');
        
        // Устанавливаем размеры
        const size = Math.min(canvas.parentElement.clientWidth, 600);
        canvas.width = size * 2;
        canvas.height = size * 2;
        ctx.scale(2, 2);
        
        const center = size / 2;
        
        // Очищаем canvas
        ctx.clearRect(0, 0, size, size);
        
        // Рисуем фон
        this.drawParchmentBackground(ctx, size, size);
        
        // Рисуем заголовок
        this.drawTitle(ctx, center, 50, 'Карта вашего дня');
        
        // Рисуем локацию
        this.drawLocationInfo(ctx, center, 100, location);
        
        // Рисуем мандалу из карт
        this.drawCardMandala(ctx, center, center + 50, spread, discoveredCards);
        
        // Рисуем маршрут
        this.drawJourneyRoute(ctx, spread, discoveredCards, center, center + 50);
        
        // Рисуем дату и подпись
        this.drawDateAndSignature(ctx, size, size);
        
        // Рисуем декоративные элементы
        this.drawDecorations(ctx, size, size);
    }
    
    drawParchmentBackground(ctx, width, height) {
        // Основной цвет пергамента
        ctx.fillStyle = '#f5e9d4';
        ctx.fillRect(0, 0, width, height);
        
        // Текстура старой бумаги
        ctx.fillStyle = 'rgba(44, 24, 16, 0.05)';
        
        for (let i = 0; i < 500; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 1.5;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Обводка
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, width - 20, height - 20);
        
        // Внутренняя обводка
        ctx.strokeStyle = 'rgba(44, 24, 16, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(15, 15, width - 30, height - 30);
        ctx.setLineDash([]);
    }
    
    drawTitle(ctx, centerX, y, title) {
        ctx.save();
        
        ctx.fillStyle = '#2c1810';
        ctx.font = 'bold 28px Unifraktur, cursive';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Тень
        ctx.shadowColor = 'rgba(201, 169, 110, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(title, centerX, y);
        
        // Подчеркивание
        const textWidth = ctx.measureText(title).width;
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - textWidth/2 - 10, y + 15);
        ctx.lineTo(centerX + textWidth/2 + 10, y + 15);
        ctx.stroke();
        
        ctx.restore();
    }
    
    drawLocationInfo(ctx, centerX, y, location) {
        ctx.save();
        
        // Иконка локации
        const icons = {
            forest: '🌲',
            mountains: '⛰️',
            ocean: '🌊',
            desert: '🏜️',
            city: '🏛️'
        };
        
        const icon = icons[location.theme] || '📍';
        
        ctx.font = '40px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(icon, centerX, y);
        
        // Название локации
        ctx.font = 'bold 22px Quicksand, sans-serif';
        ctx.fillStyle = '#2c1810';
        ctx.fillText(location.name, centerX, y + 50);
        
        // Описание
        ctx.font = '16px Cormorant, serif';
        ctx.fillStyle = '#4a3329';
        ctx.fillText(location.description, centerX, y + 80);
        
        ctx.restore();
    }
    
    drawCardMandala(ctx, centerX, centerY, spread, discoveredCards) {
        const radius = 120;
        const angleStep = (Math.PI * 2) / spread.length;
        
        spread.forEach((card, index) => {
            const angle = angleStep * index;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            this.drawCardCircle(ctx, x, y, card, discoveredCards.includes(index), index);
        });
        
        // Центральный круг
        this.drawCenterCircle(ctx, centerX, centerY, spread.length);
    }
    
    drawCardCircle(ctx, x, y, card, isDiscovered, positionIndex) {
        ctx.save();
        
        const radius = 40;
        
        // Фон круга
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        
        if (isDiscovered) {
            gradient.addColorStop(0, '#f5e9d4');
            gradient.addColorStop(1, '#e8d9c0');
        } else {
            gradient.addColorStop(0, '#4a3329');
            gradient.addColorStop(1, '#2c1810');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Обводка
        ctx.strokeStyle = isDiscovered ? '#c9a96e' : '#5c4a4a';
        ctx.lineWidth = isDiscovered ? 3 : 2;
        ctx.stroke();
        
        // Символ позиции
        const positionSymbols = ['📍', '⚔️', '💡', '🎁', '🏆'];
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isDiscovered ? '#2c1810' : '#7a6a5c';
        ctx.fillText(positionSymbols[positionIndex] || '✨', x, y - 15);
        
        // Сокращенное название карты
        if (isDiscovered) {
            const shortName = this.getShortCardName(card.name);
            ctx.font = 'bold 12px Quicksand, sans-serif';
            ctx.fillText(shortName, x, y + 10);
            
            // Индикатор реверса
            if (card.isReversed) {
                ctx.font = '10px sans-serif';
                ctx.fillText('↻', x + 15, y - 15);
            }
        } else {
            ctx.font = 'bold 14px Quicksand, sans-serif';
            ctx.fillText('???', x, y);
        }
        
        ctx.restore();
    }
    
    getShortCardName(fullName) {
        // Сокращаем длинные названия
        const words = fullName.split(' ');
        if (words.length > 2) {
            return words.slice(0, 2).join(' ') + '...';
        }
        return fullName;
    }
    
    drawCenterCircle(ctx, centerX, centerY, cardCount) {
        ctx.save();
        
        const radius = 60;
        
        // Градиентный фон
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        
        gradient.addColorStop(0, 'rgba(201, 169, 110, 0.3)');
        gradient.addColorStop(1, 'rgba(201, 169, 110, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Обводка
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Текст в центре
        ctx.font = 'bold 14px Quicksand, sans-serif';
        ctx.fillStyle = '#2c1810';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${cardCount} карт`, centerX, centerY);
        ctx.font = '12px Cormorant, serif';
        ctx.fillText('расклад', centerX, centerY + 15);
        
        ctx.restore();
    }
    
    drawJourneyRoute(ctx, spread, discoveredCards, centerX, centerY) {
        if (discoveredCards.length < 2) return;
        
        ctx.save();
        
        const radius = 120;
        const angleStep = (Math.PI * 2) / spread.length;
        
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 5]);
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        
        // Соединяем открытые карты в порядке их открытия
        discoveredCards.forEach((cardIndex, i) => {
            const angle = angleStep * cardIndex;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Рисуем точки на открытых картах
        discoveredCards.forEach(cardIndex => {
            const angle = angleStep * cardIndex;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.fillStyle = '#2c1810';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#c9a96e';
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.restore();
    }
    
    drawDateAndSignature(ctx, width, height) {
        ctx.save();
        
        const now = new Date();
        const dateStr = now.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        const timeStr = now.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Дата
        ctx.font = '14px Cormorant, serif';
        ctx.fillStyle = '#4a3329';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(dateStr, 30, height - 40);
        ctx.fillText(timeStr, 30, height - 20);
        
        // Подпись
        ctx.textAlign = 'right';
        ctx.font = 'italic 14px Cormorant, serif';
        ctx.fillText('Создано в Tarot Journey', width - 30, height - 20);
        
        ctx.restore();
    }
    
    drawDecorations(ctx, width, height) {
        ctx.save();
        
        // Угловые украшения
        ctx.strokeStyle = '#c9a96e';
        ctx.lineWidth = 1;
        
        // Левый верхний угол
        this.drawCornerDecoration(ctx, 20, 20, 'tl');
        // Правый верхний угол
        this.drawCornerDecoration(ctx, width - 20, 20, 'tr');
        // Левый нижний угол
        this.drawCornerDecoration(ctx, 20, height - 20, 'bl');
        // Правый нижний угол
        this.drawCornerDecoration(ctx, width - 20, height - 20, 'br');
        
        // Декоративные линии по краям
        ctx.strokeStyle = 'rgba(44, 24, 16, 0.1)';
        ctx.lineWidth = 0.5;
        
        // Верхняя линия
        ctx.beginPath();
        ctx.moveTo(50, 80);
        ctx.lineTo(width - 50, 80);
        ctx.stroke();
        
        // Нижняя линия
        ctx.beginPath();
        ctx.moveTo(50, height - 80);
        ctx.lineTo(width - 50, height - 80);
        ctx.stroke();
        
        ctx.restore();
    }
    
    drawCornerDecoration(ctx, x, y, position) {
        ctx.save();
        
        ctx.translate(x, y);
        
        switch(position) {
            case 'tr':
                ctx.rotate(Math.PI / 2);
                break;
            case 'br':
                ctx.rotate(Math.PI);
                break;
            case 'bl':
                ctx.rotate(Math.PI * 1.5);
                break;
        }
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(10, 0);
        ctx.lineTo(0, 10);
        ctx.closePath();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(5, 5);
        ctx.lineTo(15, 5);
        ctx.lineTo(5, 15);
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
    }
    
    // Метод для создания миниатюры карты (для истории)
    createThumbnail(spread, discoveredCards, location, size = 100) {
        const canvas = document.createElement('canvas');
        canvas.width = size * 2;
        canvas.height = size * 2;
        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2);
        
        // Упрощенная версия финальной карты
        ctx.fillStyle = '#f5e9d4';
        ctx.fillRect(0, 0, size, size);
        
        // Просто иконка локации и количество карт
        const icons = {
            forest: '🌲',
            mountains: '⛰️',
            ocean: '🌊',
            desert: '🏜️',
            city: '🏛️'
        };
        
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icons[location.theme] || '📍', size/2, size/3);
        
        ctx.font = '12px Quicksand, sans-serif';
        ctx.fillText(`${discoveredCards.length}/${spread.length}`, size/2, size * 2/3);
        
        return canvas.toDataURL('image/png');
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardRenderer;
}