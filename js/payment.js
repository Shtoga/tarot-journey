/**
 * Менеджер лицензий и платежей
 */

class LicenseManager {
    constructor() {
        this.licenseKey = 'tarot_license_data';
        this.encryptionKey = this.getUserFingerprint();
    }
    
    getUserFingerprint() {
        // Создаем уникальный отпечаток устройства на основе доступных данных
        const fingerprintData = [
            navigator.userAgent,
            navigator.language,
            screen.width,
            screen.height,
            screen.colorDepth,
            new Date().getTimezoneOffset(),
            !!navigator.cookieEnabled,
            !!navigator.doNotTrack
        ].join('|');
        
        return this.hashString(fingerprintData);
    }
    
    validatePurchase(paymentData) {
        try {
            const license = this.createLicense(paymentData);
            this.saveLicense(license);
            return true;
        } catch (error) {
            console.error('Ошибка создания лицензии:', error);
            return false;
        }
    }
    
    createLicense(paymentData) {
        const now = Date.now();
        const license = {
            userId: paymentData.userId,
            type: paymentData.type,
            purchaseDate: now,
            lastCheck: now,
            status: 'active'
        };
        
        switch(paymentData.type) {
            case 'single':
                license.expires = now + 24 * 60 * 60 * 1000; // 24 часа
                license.journeysLeft = 1;
                break;
                
            case 'weekly':
                license.expires = now + 7 * 24 * 60 * 60 * 1000; // 7 дней
                license.journeysLeft = 5;
                break;
                
            default:
                throw new Error('Неизвестный тип лицензии');
        }
        
        return license;
    }
    
    saveLicense(license) {
        const encrypted = this.encrypt(JSON.stringify(license));
        localStorage.setItem(this.licenseKey, encrypted);
        
        // Также сохраняем в историю покупок
        this.addToPurchaseHistory(license);
    }
    
    addToPurchaseHistory(license) {
        let history = JSON.parse(localStorage.getItem('tarot_purchase_history') || '[]');
        
        history.push({
            type: license.type,
            date: new Date(license.purchaseDate).toISOString(),
            journeysLeft: license.journeysLeft
        });
        
        // Оставляем только последние 10 покупок
        if (history.length > 10) {
            history = history.slice(-10);
        }
        
        localStorage.setItem('tarot_purchase_history', JSON.stringify(history));
    }
    
    getCurrentLicense() {
        try {
            const encrypted = localStorage.getItem(this.licenseKey);
            if (!encrypted) return null;
            
            const decrypted = this.decrypt(encrypted);
            const license = JSON.parse(decrypted);
            
            // Проверяем срок действия
            const now = Date.now();
            
            if (license.expires && now > license.expires) {
                license.status = 'expired';
                license.journeysLeft = 0;
                this.saveLicense(license);
            }
            
            // Обновляем время последней проверки
            license.lastCheck = now;
            this.saveLicense(license);
            
            return license;
        } catch (error) {
            console.error('Ошибка чтения лицензии:', error);
            return null;
        }
    }
    
    checkAccess() {
        const license = this.getCurrentLicense();
        
        if (!license) {
            return {
                access: false,
                reason: 'Нет активной лицензии',
                type: null,
                journeysLeft: 0
            };
        }
        
        if (license.status !== 'active') {
            return {
                access: false,
                reason: 'Лицензия не активна',
                type: license.type,
                journeysLeft: 0
            };
        }
        
        if (license.journeysLeft <= 0) {
            return {
                access: false,
                reason: 'Путешествия закончились',
                type: license.type,
                journeysLeft: 0
            };
        }
        
        return {
            access: true,
            reason: 'Доступ разрешен',
            type: license.type,
            journeysLeft: license.journeysLeft
        };
    }
    
    useJourney() {
        const license = this.getCurrentLicense();
        
        if (!license || license.journeysLeft <= 0) {
            return false;
        }
        
        license.journeysLeft--;
        
        if (license.journeysLeft <= 0) {
            license.status = 'used';
        }
        
        this.saveLicense(license);
        return true;
    }
    
    getRemainingJourneys() {
        const access = this.checkAccess();
        return access.journeysLeft;
    }
    
    // Простое шифрование (в реальном приложении нужно использовать более надежные методы)
    encrypt(text) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
            result += String.fromCharCode(charCode);
        }
        return btoa(result);
    }
    
    decrypt(encrypted) {
        const text = atob(encrypted);
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
            result += String.fromCharCode(charCode);
        }
        return result;
    }
    
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(8, '0');
    }
    
    // Методы для работы с демо-режимом
    startDemoMode() {
        const demoLicense = {
            userId: 'demo_user',
            type: 'demo',
            purchaseDate: Date.now(),
            lastCheck: Date.now(),
            status: 'active',
            expires: Date.now() + 2 * 60 * 60 * 1000, // 2 часа
            journeysLeft: 1
        };
        
        this.saveLicense(demoLicense);
        return demoLicense;
    }
    
    isDemoMode() {
        const license = this.getCurrentLicense();
        return license && license.type === 'demo';
    }
    
    // Метод для сброса всех лицензий (для тестирования)
    resetAllLicenses() {
        localStorage.removeItem(this.licenseKey);
        localStorage.removeItem('tarot_purchase_history');
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LicenseManager;
}