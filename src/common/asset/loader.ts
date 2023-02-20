type Asset = HTMLImageElement | HTMLAudioElement;

type ImageCache = { [path: string]: HTMLImageElement };
type AudioCache = { [path: string]: HTMLAudioElement };

let imageCache: ImageCache = {};
let audioCache: AudioCache = {};

export enum AssetType {
  image = "image",
  audio = "audio",
}

/**
 * Remember to (pre)`loadAssets` first.
 */
export function getImage(path: string) {
  return imageCache[path];
}

/**
 * Remember to (pre)`loadAssets` first.
 */
export function getAudio(path: string) {
  return audioCache[path];
}

// FIXME ugly function
export function loadAssets(
  paths: string[],
  type: AssetType = AssetType.image
): Promise<Asset>[] {
  const isImage = type === AssetType.image;

  return paths.map((path) => {
    return new Promise<Asset>((resolve, reject) => {
      const cached = isImage ? getImage(path) : getAudio(path);
      if (!!cached) return resolve(cached);

      const asset = isImage ? new Image() : new Audio();

      asset.onload = () => {
        if (isImage) imageCache[path] = asset as HTMLImageElement;
        else audioCache[path] = asset as HTMLAudioElement;
        resolve(asset);
      };
      asset.onerror = reject;
      asset.src = path;
    });
  });
}
