type AudioCache = { [path: string]: ArrayBuffer };

const audioCache: AudioCache = {};

export function getAudio(filePath: string) {
  return audioCache[filePath];
}

async function getBuffer(filePath: string) {
  const response = await fetch(filePath);
  return response.arrayBuffer();
}

// function createAudio(buffer: ArrayBuffer) {
//   const blob = new Blob([buffer], { type: "audio/ogg" });
//   const url = URL.createObjectURL(blob);
//   return new Audio(url);
// }

export async function loadAudio(filePath: string) {
  const exists = audioCache[filePath];
  if (exists) return exists;

  // audioCache[filePath] = createAudio(buffer);
  audioCache[filePath] = await getBuffer(filePath);
  return audioCache[filePath];
}

// export function preloadAudio(...filePaths: string[]) {
//   return filePaths.map(loadAudio);
// }
