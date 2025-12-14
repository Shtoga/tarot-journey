/**
 * Движок для отрисовки интерактивной карты путешествия
 */

class JourneyMap {
    constructor(canvasElement, location, discoveredCount = 1) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.location = location;
        this.discoveredCount = discoveredCount;
        this.totalCards = 5;
        this.fogOfWar = true;
        this.cardZones = [];
        
        this.init();
        this.draw();
    }
    
    init() {
        // Устанавливаем размеры canvas в зависимости от экрана
        this.setCanvasSize();
        
        // Создаем зоны для карт
        this.createCardZones();
        
        // Обработчик изменения размера окна
        window.addEventListener('resize', () => {
            this.setCanvasSize();
            this.createCardZones();
            this.draw();
        });
    }
    
    setCanvasSize() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Устанавливаем размеры canvas
        this.canvas.width = rect.width * 2; // Для Retina дисплеев
        this.canvas.height = rect.height * 2;
        
        // Масштабируем контекст
        this.ctx.scale(2, 2);
    }
    
    createCardZones() {
        this.cardZones = [];
        const width = this.canvas.width / 2;
        const height = this.canvas.height / 2;
        
        // Первая зона (уже открытая локация) - в центре
        this.cardZones.push({
            x: width / 2,
            y: height / 2,
            radius: 60,
            discovered: true,
            cardIndex: 0
        });
        
        // Остальные зоны распределяем по углам
        const positions = [
            { x: width * 0.2, y: height * 0.3 },   // Левый верхний
            { x: width * 0.8, y: height * 0.4 },   // Правый верхний
            { x: width * 0.4, y: height * 0.7 },   // Левый нижний
            { x: width * 0.6, y: height * 0.8 }    // Правый нижний
        ];
        
        for (let i = 0; i < 4; i++) {
            this.cardZones.push({
                x: positions[i].x,
                y: positions[i].y,
                radius: 50,
                discovered: i < this.discoveredCount - 1, // -1 потому что первая уже открыта
                cardIndex: i + 1,
                fogIntensity: 0.7 + Math.random() * 0.3
            });
        }
    }
    
    draw() {
        const width = this.canvas.width / 2;
        const height = this.canvas.height / 2;
        
        // Очищаем canvas
        this.ctx.clearRect(0, 0, width, height);
        
        // Рисуем фон локации
        this.drawBackground();
        
        // Рисуем зоны карт
        this.drawCardZones();
        
        // Рисуем туман войны
        if (this.fogOfWar) {
            this.drawFogOfWar();
        }
        
        // Рисуем маршрут
        this.drawRoute();
        
        // Рисуем компас
        this.drawCompass(width - 60, 60);
    }
    
    drawBackground() {
        const width = this.canvas.width / 2;
        const height = this.canvas.height / 2;
        
        // Градиентный фон в цветах локации
        const gradient = this.ctx.createLinearGradient(0, 0, width, height);
        
        switch(this.location.theme) {
            case 'forest':
                gradient.addColorStop(0, '#2d4a35');
                gradient.addColorStop(0.5, '#3a5d42');
                gradient.addColorStop(1, '#4a7a52');
                break;
            case 'mountains':
                gradient.addColorStop(0, '#5c4a3a');
                gradient.addColorStop(0.5, '#7a6a5c');
                gradient.addColorStop(1, '#9a8a7c');
                break;
            case 'ocean':
                gradient.addColorStop(0, '#1a4a6a');
                gradient.addColorStop(0.5, '#2c5d7a');
                gradient.addColorStop(1, '#3a7a9a');
                break;
            case 'desert':
                gradient.addColorStop(0, '#a67c52');
                gradient.addColorStop(0.5, '#b58e5c');
                gradient.addColorStop(1, '#c9a96e');
                break;
            default:
                gradient.addColorStop(0, '#4a3a2d');
                gradient.addColorStop(1, '#7a6a5c');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);
        
        // Рисуем текстуру пергамента
        this.drawParchmentTexture();
        
        // Рисуем элементы локации
        this.drawLocationElements();
    }
    
    drawParchmentTexture() {
        const width = this.canvas.width / 2;
        const height = this.canvas.height / 2;
        
        // Создаем текстуру шума
        this.ctx.fillStyle = 'rgba(245, 233, 212, 0.03)';
        
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 3 + 1;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Рисуем трещины
        this.ctx.strokeStyle = 'rgba(44, 24, 16, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 20; i++) {
            this.ctx.beginPath();
            const startX = Math.random() * width;
            const startY = Math.random() * height;
            this.ctx.moveTo(startX, startY);
            
            for (let j = 0; j < 5; j++) {
                const endX = startX + (Math.random() - 0.5) * 100;
                const endY = startY + (Math.random() - 0.5) * 100;
                this.ctx.lineTo(endX, endY);
            }
            
            this.ctx.stroke();
        }
    }
    
    drawLocationElements() {
        const width = this.canvas.width / 2;
        const height = this.canvas.height / 2;
        
        this.ctx.save();
        
        switch(this.location.theme) {
            case 'forest':
                this.drawForestElements(width, height);
                break;
            case 'mountains':
                this.drawMountainElements(width, height);
                break;
            case 'ocean':
                this.drawOceanElements(width, height);
                break;
            case 'desert':
                this.drawDesertElements(width, height);
                break;
        }
        
        this.ctx.restore();
    }
    
    drawForestElements(width, height) {
        // Рисуем деревья
        this.ctx.fillStyle = '#2d4a35';
        
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const treeHeight = Math.random() * 40 + 20;
            const treeWidth = treeHeight * 0.3;
            
            // Ствол
            this.ctx.fillRect(x - treeWidth/2, y, treeWidth, treeHeight);
            
            // Крона
            this.ctx.beginPath();
            this.ctx.arc(x, y, treeHeight * 0.8, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawMountainElements(width, height) {
        // Рисуем горы
        this.ctx.fillStyle = '#5c4a3a';
        
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * width;
            const mountainWidth = Math.random() * 100 + 50;
            const mountainHeight = Math.random() * 60 + 30;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, height);
            this.ctx.lineTo(x + mountainWidth/2, height - mountainHeight);
            this.ctx.lineTo(x + mountainWidth, height);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }
    
    drawOceanElements(width, height) {
        // Рисуем волны
        this.ctx.strokeStyle = 'rgba(26, 74, 106, 0.3)';
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < 20; i++) {
            const y = Math.random() * height;
            const amplitude = Math.random() * 20 + 5;
            const frequency = Math.random() * 0.1 + 0.05;
            
            this.ctx.beginPath();
            for (let x = 0; x < width; x += 5) {
                const waveY = y + Math.sin(x * frequency) * amplitude;
                this.ctx.lineTo(x, waveY);
            }
            this.ctx.stroke();
        }
    }
    
    drawDesertElements(width, height) {
        // Рисуем дюны
        this.ctx.fillStyle = '#a67c52';
        
        for (let i = 0; i < 10; i++) {
            const y = Math.random() * height;
            const duneHeight = Math.random() * 40 + 20;
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            
            for (let x = 0; x < width; x += 20) {
                const pointY = y + Math.sin(x * 0.05) * duneHeight;
                this.ctx.lineTo(x, pointY);
            }
            
            this.ctx.lineTo(width, height);
            this.ctx.lineTo(0, height);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }
    
    drawCardZones() {
        this.cardZones.forEach((zone, index) => {
            if (zone.discovered) {
                this.drawDiscoveredZone(zone, index);
            } else {
                this.drawHiddenZone(zone);
            }
        });
    }
    
    drawDiscoveredZone(zone, cardIndex) {
        this.ctx.save();
        
        // Внешнее свечение
        const gradient = this.ctx.createRadialGradient(
            zone.x, zone.y, 0,
            zone.x, zone.y, zone.radius * 1.5
        );
        
        gradient.addColorStop(0, 'rgba(201, 169, 110, 0.8)');
        gradient.addColorStop(0.7, 'rgba(201, 169, 110, 0.3)');
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(zone.x, zone.y, zone.radius * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Основной круг
        this.ctx.fillStyle = '#f5e9d4';
        this.ctx.beginPath();
        this.ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Обводка
        this.ctx.strokeStyle = '#c9a96e';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Символ карты
        this.ctx.fillStyle = '#2c1810';
        this.ctx.font = 'bold 24px Quicksand, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const symbols = ['📍', '⚔️', '💡', '🎁', '🏆'];
        this.ctx.fillText(symbols[cardIndex] || '✨', zone.x, zone.y);
        
        this.ctx.restore();
    }
    
    drawHiddenZone(zone) {
        this.ctx.save();
        
        // Темный круг с текстурой тумана
        const gradient = this.ctx.createRadialGradient(
            zone.x, zone.y, 0,
            zone.x, zone.y, zone.radius
        );
        
        gradient.addColorStop(0, `rgba(44, 24, 16, ${zone.fogIntensity})`);
        gradient.addColorStop(1, `rgba(44, 24, 16, ${zone.fogIntensity * 0.7})`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Обводка
        this.ctx.strokeStyle = `rgba(44, 24, 16, ${zone.fogIntensity + 0.2})`;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.stroke();
        
        // Знак вопроса
        this.ctx.fillStyle = `rgba(245, 233, 212, ${zone.fogIntensity * 0.5})`;
        this.ctx.font = 'bold 20px Quicksand, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('?', zone.x, zone.y);
        
        this.ctx.restore();
    }
    
    drawFogOfWar() {
        const width = this.canvas.width / 2;
        const height = this.canvas.height / 2;
        
        this.ctx.save();
        
        // Создаем градиент для тумана
        const gradient = this.ctx.createRadialGradient(
            width/2, height/2, 0,
            width/2, height/2, Math.max(width, height)/2
        );
        
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.3, 'rgba(245, 233, 212, 0.1)');
        gradient.addColorStop(0.6, 'rgba(245, 233, 212, 0.3)');
        gradient.addColorStop(1, 'rgba(245, 233, 212, 0.7)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);
        
        // Добавляем шум в туман
        this.ctx.fillStyle = 'rgba(44, 24, 16, 0.05)';
        
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 4 + 1;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    drawRoute() {
        this.ctx.save();
        
        this.ctx.strokeStyle = '#c9a96e';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([10, 5]);
        this.ctx.lineCap = 'round';
        
        // Соединяем открытые зоны
        const discoveredZones = this.cardZones.filter(zone => zone.discovered);
        
        if (discoveredZones.length > 1) {
            this.ctx.beginPath();
            this.ctx.moveTo(discoveredZones[0].x, discoveredZones[0].y);
            
            for (let i = 1; i < discoveredZones.length; i++) {
                this.ctx.lineTo(discoveredZones[i].x, discoveredZones[i].y);
            }
            
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    drawCompass(x, y) {
        this.ctx.save();
        
        // Внешний круг компаса
        this.ctx.strokeStyle = '#c9a96e';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 25, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Внутренний круг
        this.ctx.fillStyle = '#f5e9d4';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Стрелка
        this.ctx.fillStyle = '#2c1810';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - 15);
        this.ctx.lineTo(x - 5, y + 10);
        this.ctx.lineTo(x + 5, y + 10);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Северная точка
        this.ctx.fillStyle = '#c9a96e';
        this.ctx.beginPath();
        this.ctx.arc(x, y - 25, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    revealCard(cardIndex, clickX, clickY) {
        // Находим зону для этой карты
        const zone = this.cardZones.find(z => z.cardIndex === cardIndex);
        if (!zone) return;
        
        // Помечаем как открытую
        zone.discovered = true;
        
        // Создаем эффект рассеивания тумана
        this.createFogClearEffect(zone, clickX, clickY);
        
        // Перерисовываем карту
        this.draw();
    }
    
    createFogClearEffect(zone, clickX, clickY) {
        // В реальном приложении здесь была бы анимация
        // Для демо просто перерисовываем
        
        // Можно добавить частицы
        this.createParticles(clickX, clickY, 20);
    }
    
    createParticles(x, y, count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                // В реальном приложении здесь создавались бы частицы
                // Для демо просто перерисовываем
                this.draw();
            }, i * 20);
        }
    }
    
    isPointInZone(x, y, zone) {
        const distance = Math.sqrt(
            Math.pow(x - zone.x, 2) + Math.pow(y - zone.y, 2)
        );
        return distance <= zone.radius;
    }
    
    getZoneAtPoint(x, y) {
        return this.cardZones.find(zone => this.isPointInZone(x, y, zone));
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JourneyMap;
}