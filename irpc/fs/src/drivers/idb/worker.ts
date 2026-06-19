import { IDBStore } from './store.js';

const stores = new Map<string, IDBStore>();

self.addEventListener('fetch', (event: FetchEvent) => {
  const parts = new URL(event.request.url).pathname.split('/');
  if (parts[1] !== 'idb-blob') return;

  const dbName = parts[2];
  const blobStore = parts[3];
  const storeKey = `${dbName}:${blobStore}`;

  let store = stores.get(storeKey);
  if (!store) {
    store = new IDBStore({ dbName, metaStore: 'meta', blobStore });
    stores.set(storeKey, store);
  }

  const key = `/${parts.slice(4).join('/')}`;

  event.respondWith(
    store.getMeta(key).then((meta) => {
      if (!meta) return new Response('Not Found', { status: 404 });
      return store.getBlob(key).then((blob) => {
        if (!blob) return new Response('Not Found', { status: 404 });
        return new Response(blob, { headers: { 'Content-Type': meta.mime } });
      });
    })
  );
});
