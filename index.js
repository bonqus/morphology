"use strict";
exports.__esModule = true;
exports.union = exports.intersection = exports.opening = exports.closing = exports.erosion = exports.dilation = exports.init = void 0;
var bitFlip = function (bin) { return !bin; };
var complement = function (img) { return img.map(function (row) { return row.map(bitFlip); }); };
var init = function (img) {
    return img.map(function (row) { return row.map(Boolean); });
};
exports.init = init;
var dilation = function (img, structElem) {
    var _a, _b, _c, _d, _e, _f;
    var height = img.length;
    var width = (_b = (_a = img[0]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    var sHeight = structElem.length;
    var sWidth = (_d = (_c = structElem[0]) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0;
    var res = new Array(height)
        .fill(0)
        .map(function () { return new Array(width).fill(0); });
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var currentPixel = false;
            for (var sI = -Math.floor(sHeight / 2); sI < Math.ceil(sHeight / 2); sI++) {
                for (var sJ = -Math.floor(sWidth / 2); sJ < Math.ceil(sWidth / 2); sJ++) {
                    if (i + sI >= 0 && i + sI < height && j + sJ >= 0 && j + sJ < width) {
                        var sCurrentPixel = !!((_e = structElem[sHeight - (Math.floor(sHeight / 2) + sI) - 1]) === null || _e === void 0 ? void 0 : _e[sWidth - (Math.floor(sWidth / 2) + sJ) - 1]);
                        if (sCurrentPixel && ((_f = img[i + sI]) === null || _f === void 0 ? void 0 : _f[j + sJ])) {
                            currentPixel = true;
                        }
                    }
                }
            }
            res[i][j] = currentPixel;
        }
    }
    return res;
};
exports.dilation = dilation;
var erosion = function (img, structElem) {
    return complement((0, exports.dilation)(complement(img), structElem));
};
exports.erosion = erosion;
var closing = function (img, structElem) {
    return (0, exports.erosion)((0, exports.dilation)(img, structElem), structElem);
};
exports.closing = closing;
var opening = function (img, structElem) {
    return (0, exports.dilation)((0, exports.erosion)(img, structElem), structElem);
};
exports.opening = opening;
var intersection = function (imgA, imgB) { return map2rank2(imgA, imgB, function (a, b) { return a && b; }); };
exports.intersection = intersection;
var union = function (imgA, imgB) {
    return map2rank2(imgA, imgB, function (a, b) { return a || b; });
};
exports.union = union;
var map2 = function (as, bs, f) {
    return condErr(as.length !== bs.length, "as and bs must have the same length") &&
        as.map(function (_, i) { return f(as[i], bs[i]); });
};
/**
 *
 * @param ass array of array of values
 * @param bss array of array of values
 * @param f function to be applied to the pairwise values of ass and bss
 * @returns
 */
var map2rank2 = function (ass, bss, f) {
    return map2(ass, bss, function (aRow, bRow) { return map2(aRow, bRow, f); });
};
var condErr = function (cond, msg) {
    if (cond)
        throw new Error(msg);
    return true;
};
