type Rect = { left: number; top: number; width: number; height: number };

/** Sample only available source pixels; never invent detail by enlarging them. */
export function getLoupeGeometry({ stage, image, x, y, diameter, sourceWidth, sourceHeight, maxZoom }: {
  stage: Rect; image: Rect; x: number; y: number; diameter: number;
  sourceWidth: number; sourceHeight: number; maxZoom: number;
}) {
  if (image.width <= 0 || image.height <= 0 || stage.width < diameter || stage.height < diameter || diameter <= 0) return null;
  const u = (x - image.left) / image.width;
  const v = (y - image.top) / image.height;
  const zoom = Math.min(maxZoom, sourceWidth / image.width, sourceHeight / image.height);
  if (u < 0 || u > 1 || v < 0 || v > 1 || zoom <= 1) return null;
  const radius = diameter / 2;
  const clamp = (value: number, limit: number) => Math.max(radius, Math.min(limit - radius, value));
  return {
    left: clamp(x - stage.left, stage.width) - radius,
    top: clamp(y - stage.top, stage.height) - radius,
    width: image.width * zoom, height: image.height * zoom,
    backgroundX: radius - u * image.width * zoom,
    backgroundY: radius - v * image.height * zoom,
    zoom,
  };
}
