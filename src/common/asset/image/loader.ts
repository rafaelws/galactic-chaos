type ImageCache = {
  [path: string]: HTMLImageElement;
};

let cache: ImageCache = {};

/**
 * BE SURE TO USE `loadImages` first.
 *
 * Returns a cached image.
 *
 * @param path - the image path
 * @returns the requested image from cache
 */
export function getImage(path: string): HTMLImageElement {
  return cache[path];
}

function load(path: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const cached = getImage(path);
    if (!!cached) return resolve(cached);

    const image = new Image();
    image.onload = () => {
      cache[path] = image;
      resolve(image);
    };
    image.onerror = reject;
    image.src = path;
  });
}

export function loadImages(...paths: string[]): Promise<HTMLImageElement>[] {
  return paths.map(load);
}
