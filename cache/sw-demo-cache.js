var VERSION = 'v6';

// 缓存
self.addEventListener('install', function(event) {
  console.log(111)
  event.waitUntil(
    caches.open(VERSION).then(function(cache) {
      return cache.addAll([
        './start.html',
        './static/jquery.min.js',
        './static/mm1.jpg'
      ]);
    })
  );
});

// 缓存更新
self.addEventListener('activate', function(event) {
  console.log(222)
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      console.log(cacheNames);
      console.log(VERSION)
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // 如果当前版本和缓存版本不一致
          if (cacheName !== VERSION) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 捕获请求并返回缓存数据
self.addEventListener('fetch', function(event) {
  console.log(44444)
  event.respondWith(caches.match(event.request).catch(function() {
    return fetch(event.request);
  }).then(function(response) {
    caches.open(VERSION).then(function(cache) {
      cache.put(event.request, response);
    });
    return response.clone();
  }).catch(function() {
    return caches.match('./static/mm1.jpg');
  }));
});