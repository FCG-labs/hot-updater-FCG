import { describe, expect, it, vi } from "vitest";

const { globSync, search } = vi.hoisted(() => ({
  globSync: vi.fn(),
  search: vi.fn(),
}));

vi.mock("fast-glob", () => ({
  default: {
    sync: globSync,
  },
}));

vi.mock("cosmiconfig", () => ({
  cosmiconfig: () => ({ search }),
  cosmiconfigSync: () => ({ search }),
}));

vi.mock("./cwd.js", () => ({
  getCwd: () => "/mock/project",
}));

import { loadConfig } from "./loadConfig";

describe("loadConfig", () => {
  it("excludes generated and framework plist paths from defaults", async () => {
    search.mockResolvedValueOnce({ config: {} });
    globSync.mockImplementation((pattern: string, options?: { ignore?: string[] }) => {
      if (pattern === "**/Info.plist") {
        expect(options?.ignore).toEqual(
          expect.arrayContaining([
            "**/DerivedData/**",
            "**/*.xcresult/**",
            "**/*.xcframework/**",
            "**/*.framework/**",
          ]),
        );
        return ["Atflee/Info.plist"];
      }

      return [];
    });

    const config = await loadConfig(null);

    expect(config.platform.ios.infoPlistPaths).toEqual([
      "ios/Atflee/Info.plist",
    ]);
  });
});
