import * as morph from "./index";
import fc from "fast-check";
const IMAGE_SIZE = { minLength: 10, maxLength: 10 } as const;
const KERNEL_SIZE = { minLength: 3, maxLength: 10 } as const;
const KERNEL = morph.init([
  [0, 1, 0],
  [1, 1, 1],
  [0, 1, 0],
]);

const IMAGE_3 = morph.init([
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
]);

const DILATION_KERNAL_IMAGE_3 = morph.init([
  [0, 0, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0],
]);

describe("dilation", () => {
  it("should dilate the image", () => {
    const result = morph.dilation([], []);
    expect(result).toStrictEqual([]);
  });

  it("should dilate the ", () => {
    const result = morph.dilation(IMAGE_3, KERNEL);
    expect(result).toStrictEqual(DILATION_KERNAL_IMAGE_3);
  });
});

describe("erosion", () => {
  it("should erode the image", () => {
    const result = morph.erosion([], []);
    expect(result).toStrictEqual([]);
  });
});

describe("opening", () => {
  it("should open the image", () => {
    const result = morph.opening([], []);
    expect(result).toStrictEqual([]);
  });
});

describe("closing", () => {
  it("should close the image", () => {
    const result = morph.closing([], []);
    expect(result).toStrictEqual([]);
  });
});

test("Distributivity of union of dilation: ( A1 ∪ A2 ) ⊕ B = ( A1 ⊕ B ) ∪ ( A2 ⊕ B )", () => {
  fc.assert(
    fc.property(
      fc.array(fc.array(fc.boolean(), IMAGE_SIZE), IMAGE_SIZE),
      fc.array(fc.array(fc.boolean(), IMAGE_SIZE), IMAGE_SIZE),
      fc.array(fc.array(fc.boolean(), KERNEL_SIZE), KERNEL_SIZE),
      (a1, a2, b) => {
        // ( A1 ∪ A2 ) ⊕ B
        const eq1 = morph.dilation(morph.union(a1, a2), b);

        // ( A1 ⊕ B ) ∪ ( A2 ⊕ B )
        const eq2 = morph.union(morph.dilation(a1, b), morph.dilation(a2, b));
        expect(eq1).toStrictEqual(eq2);
      }
    )
  );
});

test("Distributivity of intersection of erosion:( A1 ∩ A2 ) ⊖ B = ( A1 ⊖ B ) ∩ ( A1 ⊖ B )", () => {
  fc.assert(
    fc.property(
      fc.array(fc.array(fc.boolean(), IMAGE_SIZE), IMAGE_SIZE),
      fc.array(fc.array(fc.boolean(), IMAGE_SIZE), IMAGE_SIZE),
      fc.array(fc.array(fc.boolean(), KERNEL_SIZE), KERNEL_SIZE),
      (a1, a2, b) => {
        // ( A1 ∩ A2 ) ⊖ B
        const eq1 = morph.erosion(morph.intersection(a1, a2), b);

        // ( A1 ⊖ B ) ∩ ( A1 ⊖ B )
        const eq2 = morph.intersection(
          morph.erosion(a1, b),
          morph.erosion(a2, b)
        );

        expect(eq1).toStrictEqual(eq2);
      }
    )
  );
});
