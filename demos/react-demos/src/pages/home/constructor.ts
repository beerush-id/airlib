import { stream } from '@irpclib/irpc';
import { irpc } from '../../lib/module.js';
import { submitContact, watchPrice } from './function.js';

irpc.construct(submitContact, async (data) => {
  await new Promise((r) => setTimeout(r, 1200));
  console.log('[Server] Form submitted via IRPC:', data);
  return { success: true, message: `Thanks, ${data.name}!` };
});

irpc.construct(watchPrice, (symbol) => {
  return stream(async (state, resolve) => {
    state.data = { symbol, price: symbol.length * 15 + 20 };

    let tick = 0;
    const interval = setInterval(() => {
      tick++;

      if (tick >= 100) {
        clearInterval(interval);
        resolve();
        return;
      }

      state.data.price = state.data.price + (Math.random() * 2 - 1);
    }, 50);

    return () => clearInterval(interval);
  });
});
