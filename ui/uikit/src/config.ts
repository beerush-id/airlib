export const KIT_CONFIGS = {
  autofocus: true,
  trapOverflow: true,

  dialogPortal: 'body',
};

export function configureKit(config: Partial<typeof KIT_CONFIGS>) {
  Object.assign(KIT_CONFIGS, config);
}
