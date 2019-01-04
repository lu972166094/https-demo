var VERSION = 'v10';

// 缓存
self.addEventListener('install', function(event) {
  console.log('install')
  console.log(VERSION)
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
  console.log('activate')
  console.log(VERSION)
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
// self.addEventListener('fetch', function(event) {
//   console.log(44444)
//   event.respondWith(caches.match(event.request).catch(function() {
//     return fetch(event.request);
//   }).then(function(response) {
//     caches.open(VERSION).then(function(cache) {
//       cache.put(event.request, response);
//     });
//     return response.clone();
//   }).catch(function() {
//     return caches.match('./static/mm1.jpg');
//   }));
// });
self.addEventListener('fetch', function(e) {
  console.log('Fetch event ' + VERSION + ' :', e.request.url);
  e.respondWith( // 该策略先从网络中获取资源，如果获取失败则再从缓存中读取资源
    fetch(e.request.url)
    .then(function (httpRes) {

      // 请求失败了，直接返回失败的结果
      if (!httpRes || httpRes.status !== 200) {
          // return httpRes;
          return caches.match(e.request)
      }

      // 请求成功的话，将请求缓存起来。
      var responseClone = httpRes.clone();
      caches.open(VERSION).then(function (cache) {
          return cache.delete(e.request)
          .then(function() {
              cache.put(e.request, responseClone);
          });
      });

      return httpRes;
    })
    .catch(function(err) { // 无网络情况下从缓存中读取
      console.error(err);
      return caches.match(e.request);
    })
  )
})