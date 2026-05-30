const CACHE_NAME = 'empire-launch-ai-v4.5.4';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/branded-globe.png',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Clear old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Network-First strategy for navigation to ensure we always get latest HTML/Version check
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/');
      })
    );
    return;
  }

  // Cache-First for assets, but we should ideally use Network-First for JSON/API if needed
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Push Notification Logic
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { 
      title: 'Empire Alert', 
      body: event.data.text(),
      icon: '/branded-globe.png',
      data: { url: '/dashboard' }
    };
  }
  
  const title = data.title || 'Empire Alert';
  const options = {
    body: data.body || 'Your autonomous agent has an update.',
    icon: data.icon || '/branded-globe.png',
    badge: '/favicon.ico',
    tag: data.tag || 'empire-update',
    renotify: true,
    data: {
      url: data.url || (data.data && data.data.url) || '/dashboard'
    },
    // Visual/Haptic cues
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open', title: 'View Hub' },
      { action: 'close', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    let matchingClient = null;

    for (let i = 0; i < windowClients.length; i++) {
      const client = windowClients[i];
      if (client.url === urlToOpen) {
        matchingClient = client;
        break;
      }
    }

    if (matchingClient) {
      return matchingClient.focus();
    } else {
      return clients.openWindow(urlToOpen);
    }
  });

  event.waitUntil(promiseChain);
});
