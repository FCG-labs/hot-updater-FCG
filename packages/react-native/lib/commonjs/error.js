"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HotUpdaterError = void 0;
class HotUpdaterError extends Error {
  constructor(message) {
    super(message);
    this.name = "HotUpdaterError";
  }
}
exports.HotUpdaterError = HotUpdaterError;
//# sourceMappingURL=error.js.map