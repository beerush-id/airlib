export type AnimationFrame = (() => void) & {
  cancel: () => void;
};

export function animationFrame(callback: FrameRequestCallback): AnimationFrame {
  let rafId = 0;

  const cancel = () => cancelAnimationFrame(rafId);
  const schedule = () => {
    cancel();
    rafId = requestAnimationFrame(callback);
  };
  schedule.cancel = cancel;

  return schedule;
}
