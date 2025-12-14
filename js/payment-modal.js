/**
 * Красивые модальные окна оплаты
 */

class PaymentModal {
    constructor() {
        this.modal = document.getElementById('payment-modal');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Кнопки открытия модального окна
        document.getElementById('buy-single')?.addEventListener('click', () => {
            this.show('single');
        });
        
        document.getElementById('buy-weekly')?.addEventListener('click', () => {
            this.show('weekly');
        });
        
        // Кнопка закрытия
        document.getElementById('close-payment')?.addEventListener('click', () => {
            this.hide();
        });
        
        // Закрытие по клику вне окна
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });
    }
    
    show(type) {
        if (!this.modal) return;
        
        const options = {
            single: {
                title: "Одно путешествие",
                price: "99 ₽",
                features: [
                    "📖 Полный доступ к сегодняшнему раскладу",
                    "🗺️ 5 карт с уникальными артефактами", 
                    "💾 Сохранение карты дня",
                    "⏳ Доступ на 24 часа"
                ],
                popular: false
            },
            weekly: {
                title: "Пакет «Исследователь»",
                price: "399 ₽",
                features: [
                    "⚡ 5 путешествий на неделю",
                    "🎁 Бонусные эксклюзивные артефакты",
                    "📊 Расширенная статистика",
                    "⭐ Приоритетная поддержка",
                    "💎 +3 монеты ежедневно"
                ],
                popular: true
            }
        };
        
        const option = options[type];
        if (!option) return;
        
        // Создаем содержимое модального окна
        const modalContent = `
            <div class="modal-header">
                <h3>${option.title}</h3>
                ${option.popular ? '<span class="popular-badge">Популярный</span>' : ''}
            </div>
            
            <div class="modal-price">
                <span class="price-amount">${option.price}</span>
                ${type === 'weekly' ? '<span class="price-per">(79.80 ₽ за путешествие)</span>' : ''}
            </div>
            
            <div class="modal-features">
                <h4>Что входит:</h4>
                <ul>
                    ${option.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            
            <div class="modal-benefits">
                <div class="benefit-item">
                    <span class="benefit-icon">⚡</span>
                    <span class="benefit-text">Мгновенный доступ</span>
                </div>
                <div class="benefit-item">
                    <span class="benefit-icon">📱</span>
                    <span class="benefit-text">Доступно на всех устройствах</span>
                </div>
                <div class="benefit-item">
                    <span class="benefit-icon">🔄</span>
                    <span class="benefit-text">Возврат в течение 14 дней</span>
                </div>
            </div>
            
            <button class="btn btn-primary btn-buy" data-type="${type}">
                <span class="btn-icon">✨</span>
                <span class="btn-text">Начать путешествие</span>
            </button>
            
            <button class="btn btn-ghost btn-close">
                Назад к выбору
            </button>
        `;
        
        // Вставляем контент
        this.modal.querySelector('.modal-content').innerHTML = modalContent;
        
        // Показываем модальное окно
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
        
        // Добавляем обработчики для новых кнопок
        this.modal.querySelector('.btn-buy')?.addEventListener('click', () => {
            this.processPayment(type);
        });
        
        this.modal.querySelector('.btn-close')?.addEventListener('click', () => {
            this.hide();
        });
    }
    
    hide() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            document.body.style.overflow = ''; // Возвращаем скролл
        }
    }
    
    processPayment(type) {
        console.log(`Обработка платежа: ${type}`);
        
        // Показываем анимацию загрузки
        const buyBtn = this.modal.querySelector('.btn-buy');
        if (buyBtn) {
            const originalText = buyBtn.innerHTML;
            buyBtn.innerHTML = '<div class="spinner"></div><span>Обработка...</span>';
            buyBtn.disabled = true;
            
            // Имитация обработки платежа
            setTimeout(() => {
                this.hide();
                alert(`✅ Платеж успешно обработан!\nВы приобрели: ${type === 'single' ? 'Одно путешествие' : 'Пакет "Исследователь"'}`);
                
                // В реальном приложении здесь был бы вызов API платежной системы
                // и переход к путешествию
                
            }, 1500);
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.paymentModal = new PaymentModal();
});