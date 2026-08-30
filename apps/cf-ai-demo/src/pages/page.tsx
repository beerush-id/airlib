import { Meta, mutable, page, Title } from '@airlib/react';
import { ChatDrawer } from '../components/ChatDrawer.js';
import { GenerationDock } from '../components/GenerationDock.js';
import { Header } from '../components/Header.js';
import { LightboxModal } from '../components/LightboxModal.js';
import { MediaGallery } from '../components/MediaGallery.js';
import { Sidebar } from '../components/Sidebar.js';
import { indexRoute } from './route.js';

export const RootPage = page(indexRoute).render(() => {
  const signalStore = mutable<{ count: number }>({ count: 0 });

  return (
    <>
      <Title>Cloudflare AI Studio — AIR Stack Demo</Title>
      <Meta
        name="description"
        content="Showcasing AIR Stack (Anchor Reactivity + Isomorphic RPC) as Cloudflare's full-stack edge alternative for AI Media & Chat."
      />

      <div className="relative min-h-screen flex flex-col">
        <Header />
        <Sidebar />
        <MediaGallery refreshSignal={signalStore.count} />
        <GenerationDock
          onCreated={() => {
            signalStore.count++;
          }}
        />
        <ChatDrawer />
        <LightboxModal />
      </div>
    </>
  );
});

export default RootPage;
