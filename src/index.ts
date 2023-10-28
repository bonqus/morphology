export type Binary = boolean;
export type BinaryMatrix = Binary[][];

const bitFlip = (bin: Binary): Binary => !bin;

const complement = (img: BinaryMatrix) => img.map((row) => row.map(bitFlip));

export const init: (img: number[][]) => BinaryMatrix = (img) =>
  img.map((row) => row.map(Boolean));

export const dilation = (img: BinaryMatrix, structElem: BinaryMatrix) => {
  const height = img.length;
  const width = img[0]?.length ?? 0;

  const sHeight = structElem.length;

  const sWidth = structElem[0]?.length ?? 0;

  const res: BinaryMatrix = new Array(height)
    .fill(0)
    .map(() => new Array(width).fill(0));

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      let currentPixel: Binary = false;

      for (
        let sI = -Math.floor(sHeight / 2);
        sI < Math.ceil(sHeight / 2);
        sI++
      ) {
        for (
          let sJ = -Math.floor(sWidth / 2);
          sJ < Math.ceil(sWidth / 2);
          sJ++
        ) {
          if (i + sI >= 0 && i + sI < height && j + sJ >= 0 && j + sJ < width) {
            const sCurrentPixel =
              !!structElem[sHeight - (Math.floor(sHeight / 2) + sI) - 1]?.[
                sWidth - (Math.floor(sWidth / 2) + sJ) - 1
              ];

            if (sCurrentPixel && img[i + sI]?.[j + sJ]) {
              currentPixel = true;
            }
          }
        }
      }

      res[i]![j] = currentPixel;
    }
  }
  return res;
};

export const erosion = (img: BinaryMatrix, structElem: BinaryMatrix) =>
  complement(dilation(complement(img), structElem));

export const closing = (img: BinaryMatrix, structElem: BinaryMatrix) =>
  erosion(dilation(img, structElem), structElem);

export const opening = (img: BinaryMatrix, structElem: BinaryMatrix) =>
  dilation(erosion(img, structElem), structElem);

export const intersection = (
  imgA: BinaryMatrix,
  imgB: BinaryMatrix
): BinaryMatrix => map2rank2(imgA, imgB, (a, b) => a && b);

export const union = (imgA: BinaryMatrix, imgB: BinaryMatrix): BinaryMatrix =>
  map2rank2(imgA, imgB, (a, b) => a || b);

const map2 = <A, B, X>(as: A[], bs: B[], f: (a: A, b: B) => X) =>
  condErr(as.length !== bs.length, "as and bs must have the same length") &&
  as.map((_, i) => f(as[i]!, bs[i]!));

/**
 *
 * @param ass array of array of values
 * @param bss array of array of values
 * @param f function to be applied to the pairwise values of ass and bss
 * @returns
 */
const map2rank2 = <A, B, X>(ass: A[][], bss: B[][], f: (a: A, b: B) => X) =>
  map2(ass, bss, (aRow, bRow) => map2(aRow, bRow, f));

const condErr = (cond: boolean, msg: string): true => {
  if (cond) throw new Error(msg);
  return true;
};
