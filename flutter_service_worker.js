'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "c06054f14ed81365100fd2a7aa5d639e",
"assets/FontManifest.json": "83c192b1dd577bbf941141bbbf0bf69f",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/lib/assets/background.png": "908c6c7bcfa8b5382c08dddb48acc2a7",
"assets/lib/assets/black.png": "70071411f133765f4ebaffda89323b95",
"assets/lib/assets/black_network.PNG": "65777b6f2e9a2c6e81e74f65f9375f20",
"assets/lib/assets/code.PNG": "d82a15e2f7660a4395a5b9bf777b5f17",
"assets/lib/assets/date_diamond.png": "f67f82555bcbbdcc44bd9585b80e889d",
"assets/lib/assets/dots.png": "2ce587626eacdb5babd82232cb0f297e",
"assets/lib/assets/falcon.png": "511bb3ce00ed99b6a65fce2b6b9686c2",
"assets/lib/assets/frame.png": "08124da5d5d7b43befe20da762ad05ab",
"assets/lib/assets/golden_frame.png": "948798ea7f12bc472c3b6b34768b2a1d",
"assets/lib/assets/grey.png": "b37c65076932676c26275d24d6db9c20",
"assets/lib/assets/Group%2520214.png": "511bb3ce00ed99b6a65fce2b6b9686c2",
"assets/lib/assets/header.png": "3932fcfc22f55b8ca3a9dcc1d6a30160",
"assets/lib/assets/location.png": "93fa0be0ed73364be394715c361f760a",
"assets/lib/assets/location_diamond.png": "7f83f2827b08879fb61a041c1f86dcf1",
"assets/lib/assets/map_back.png": "7038b2096e757bff97b8035dc7cd28c4",
"assets/lib/assets/mix.png": "770f1c8adedff06334beb94515ee407e",
"assets/lib/assets/mouse_icon.png": "3593aa42d1862591ab880404c4a2486b",
"assets/lib/assets/result.PNG": "4c487cec2e6e032c3e9485ab73301d22",
"assets/lib/assets/speaker.png": "131f81f72450db1ac474b971d35096be",
"assets/lib/assets/splash.png": "a7e3410d165cba5b4db56f76354eacf2",
"assets/lib/assets/splash2.png": "1ff6ca481b3a8222de5e1bff8368097a",
"assets/lib/assets/technovation.png": "d400428ac9b846933c6985d363794062",
"assets/lib/assets/technovation2.png": "8ef6eb4ef938cdbd01ee6b7158415047",
"assets/lib/assets/test.svg": "e8e3ae848846ca35c1cb2ae1314c9379",
"assets/lib/assets/user.jpeg": "690e58927705f7c759159caee6dd89c5",
"assets/lib/fonts/LamaSans-Regular.otf": "7ee1cbb3aa17e1c392a0a34bc3a6f241",
"assets/NOTICES": "a9c890e970f19663e3c21913edde2886",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "01e5d6679798ccbd493fda4bb036117d",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "414e746ce406fb8bccbf9013d2680883",
"/": "414e746ce406fb8bccbf9013d2680883",
"main.dart.js": "66dc76bdd4623568c9653ac3b48ce814",
"manifest.json": "45251324d35933906343e5105376b445",
"version.json": "452da255f59fd95db5c969037a1b021c"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
