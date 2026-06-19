export const FS_MIME_GROUP = {
  application: 'application',
  audio: 'audio',
  font: 'font',
  image: 'image',
  message: 'message',
  model: 'model',
  text: 'text',
  video: 'video',
} as const;

export const FS_MIME_MAPS = new Map([
  [
    FS_MIME_GROUP.application,
    new Set([
      'zip',
      'pdf',
      'tar',
      'rar',
      '7z',
      'json',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'ppt',
      'pptx',
      'wasm',
      'msg',
      'rtf',
      'epub',
      'jar',
      'apk',
      'exe',
      'bin',
      'dmg',
      'iso',
      'gz',
      'bz2',
      'xz',
    ]),
  ],
  [FS_MIME_GROUP.audio, new Set(['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'midi', 'mid'])],
  [FS_MIME_GROUP.font, new Set(['ttf', 'otf', 'woff', 'woff2'])],
  [
    FS_MIME_GROUP.image,
    new Set(['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'avif', 'bmp', 'tiff', 'tif', 'heic', 'heif']),
  ],
  [FS_MIME_GROUP.message, new Set(['eml'])],
  [FS_MIME_GROUP.model, new Set(['glb', 'gltf'])],
  [
    FS_MIME_GROUP.text,
    new Set([
      'txt',
      'html',
      'css',
      'js',
      'csv',
      'xml',
      'md',
      'ts',
      'tsx',
      'jsx',
      'yaml',
      'yml',
      'ini',
      'conf',
      'log',
      'toml',
    ]),
  ],
  [FS_MIME_GROUP.video, new Set(['mp4', 'webm', 'avi', 'mov', 'mkv', 'mpg', 'mpeg', 'wmv', 'flv', '3gp'])],
]);

export const FS_MIME_ALIAS = new Map([
  ['js', 'javascript'],
  ['ts', 'typescript'],
  ['md', 'markdown'],
  ['svg', 'svg+xml'],
  ['doc', 'msword'],
  ['docx', 'vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ['xls', 'vnd.ms-excel'],
  ['xlsx', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  ['ppt', 'vnd.ms-powerpoint'],
  ['pptx', 'vnd.openxmlformats-officedocument.presentationml.presentation'],
  ['mp3', 'mpeg'],
  ['jpg', 'jpeg'],
  ['msg', 'vnd.ms-outlook'],
  ['eml', 'rfc822'],
  ['txt', 'plain'],
  ['ini', 'plain'],
  ['conf', 'plain'],
  ['log', 'plain'],
  ['mpg', 'mpeg'],
  ['mid', 'midi'],
  ['tif', 'tiff'],
  ['yml', 'yaml'],
  ['epub', 'epub+zip'],
  ['jar', 'java-archive'],
  ['apk', 'vnd.android.package-archive'],
  ['exe', 'octet-stream'],
  ['bin', 'octet-stream'],
  ['dmg', 'octet-stream'],
  ['iso', 'octet-stream'],
  ['gz', 'gzip'],
  ['bz2', 'x-bzip2'],
  ['xz', 'x-xz'],
]);

export const FS_MIME_TYPES = Array.from(FS_MIME_MAPS.entries()).reduce((acc, [mime, extensions]) => {
  for (const ext of extensions) {
    acc.set(ext, `${mime}/${FS_MIME_ALIAS.get(ext) ?? ext}`);
  }

  return acc;
}, new Map<string, string>());

export const FS_FILE_TYPES = Array.from(FS_MIME_TYPES.entries()).reduce((acc, [ext, mime]) => {
  if (FS_MIME_ALIAS.has(ext)) {
    const aliasedMime = mime.replace(`/${ext}`, `/${FS_MIME_ALIAS.get(ext)!}`);
    if (!acc.has(aliasedMime)) acc.set(aliasedMime, ext);
  }
  if (!acc.has(mime)) acc.set(mime, ext);
  return acc;
}, new Map<string, string>());
