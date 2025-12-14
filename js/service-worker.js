/**
 * Service Worker для офлайн-работы и PWA
 */

const CACHE_NAME = 'tarot-journey-v1';
const OFFLINE_URL = '/offline.html';

// Файлы для кэширования при установке
const PRECACHE_FILES = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/animations.css',
    '/js/app.js',
    '/js/tarot-deck.js',
    '/js/map-engine.js',
    '/js/payment.js',
    '/js/render-card.js',
    '/data/tarot-data.json',
    '/data/locations.json',
    '/data/artifacts.json',
    '/images/ui/favicon.ico',
    '/images/ui/logo-192.png',
    '/images/ui/logo-512.png'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Установка');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Кэширование файлов');
                return cache.addAll(PRECACHE_FILES);
            })
            .then(() => {
                console.log('[Service Worker] Установка завершена');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Ошибка установки:', error);
            })
    );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Активация');
    
    // Удаляем старые кэши
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Удаление старого кэша:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('[Service Worker] Активация завершена');
            return self.clients.claim();
        })
    );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
    // Пропускаем не-GET запросы
    if (event.request.method !== 'GET') return;
    
    // Пропускаем chrome-extension запросы
    if (event.request.url.startsWith('chrome-extension://')) return;
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Возвращаем кэшированный ответ, если он есть
                if (cachedResponse) {
                    console.log('[Service Worker] Использую кэш для:', event.request.url);
                    return cachedResponse;
                }
                
                // Иначе загружаем из сети
                return fetch(event.request)
                    .then((response) => {
                        // Проверяем валидность ответа
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Клонируем ответ, потому что он может быть использован только один раз
                        const responseToCache = response.clone();
                        
                        // Добавляем в кэш для будущих запросов
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                                console.log('[Service Worker] Кэширован новый ресурс:', event.request.url);
                            });
                        
                        return response;
                    })
                    .catch((error) => {
                        console.error('[Service Worker] Ошибка загрузки:', error);
                        
                        // Если запрос HTML-страницы и мы офлайн, показываем offline страницу
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match(OFFLINE_URL);
                        }
                        
                        // Для других запросов возвращаем заглушку
                        return new Response('Нет подключения к интернету', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Обработка сообщений от основного приложения
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME);
    }
});

// Фоновая синхронизация (если поддерживается)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-analytics') {
        event.waitUntil(syncAnalyticsData());
    }
});

// Фоновая периодическая синхронизация (если поддерживается)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-content') {
        event.waitUntil(updateCachedContent());
    }
});

// Синхронизация аналитических данных
async function syncAnalyticsData() {
    try {
        const analyticsData = await getStoredAnalyticsData();
        if (analyticsData.length > 0) {
            await sendAnalyticsToServer(analyticsData);
            await clearAnalyticsData();
            console.log('[Service Worker] Аналитика синхронизирована');
        }
    } catch (error) {
        console.error('[Service Worker] Ошибка синхронизации аналитики:', error);
    }
}

// Обновление кэшированного контента
async function updateCachedContent() {
    try {
        const cache = await caches.open(CACHE_NAME);
        
        // Обновляем JSON файлы с данными
        const dataFiles = [
            '/data/tarot-data.json',
            '/data/locations.json',
            '/data/artifacts.json'
        ];
        
        for (const url of dataFiles) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response);
                    console.log(`[Service Worker] Обновлен: ${url}`);
                }
            } catch (error) {
                console.error(`[Service Worker] Ошибка обновления ${url}:`, error);
            }
        }
    } catch (error) {
        console.error('[Service Worker] Ошибка обновления контента:', error);
    }
}

// Вспомогательные функции
async function getStoredAnalyticsData() {
    // В реальном приложении данные хранятся в IndexedDB
    return [];
}

async function sendAnalyticsToServer(data) {
    // В реальном приложении отправляем на сервер
    return Promise.resolve();
}

async function clearAnalyticsData() {
    // В реальном приложении очищаем IndexedDB
    return Promise.resolve();
}

// Push уведомления
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body || 'Новое путешествие ждет вас!',
        icon: '/images/ui/logo-192.png',
        badge: '/images/ui/badge.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        },
        actions: [
            {
                action: 'explore',
                title: 'Открыть',
                icon: '/images/ui/explore.png'
            },
            {
                action: 'close',
                title: 'Закрыть',
                icon: '/images/ui/close.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'Tarot Journey', options)
    );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Уведомление кликнуто:', event.notification.data);
    
    event.notification.close();
    
    if (event.action === 'close') {
        return;
    }
    
    // Открываем приложение
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});