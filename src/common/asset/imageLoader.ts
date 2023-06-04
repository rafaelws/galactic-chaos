type ImageCache = { [path: string]: HTMLImageElement };

const imageCache: ImageCache = {};

export function getImage(path: string) {
  return imageCache[path];
}

function loadImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const cached = getImage(path);
    if (cached) return resolve(cached);

    const image = new Image();

    image.onload = () => {
      imageCache[path] = image;
      resolve(image);
    };
    image.onerror = reject;
    image.src = path;
  });
}

export function preloadImages(...paths: string[]): Promise<HTMLImageElement>[] {
  return paths.map(loadImage);
}
