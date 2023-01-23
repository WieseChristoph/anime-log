import * as helper from "@/utils/helper";

describe("getBaseUrl", () => {
    const OLD_ENV = process.env;
    let windowSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.resetModules(); // Most important - it clears the cache
        process.env = { ...OLD_ENV }; // Make a copy
        windowSpy = jest.spyOn(window, "window", "get");
    });

    afterEach(() => {
        process.env = OLD_ENV; // Restore old environment
        windowSpy.mockRestore();
    });

    it("return empty string if window is defined", () => {
        const baseUrl = helper.getBaseUrl();

        expect(baseUrl).toBe("");
    });

    it("returns vercel url when env is set", () => {
        windowSpy.mockImplementation(() => undefined);
        process.env.VERCEL_URL = "test.net";

        const baseUrl = helper.getBaseUrl();

        expect(baseUrl).toBe("https://test.net");
    });

    it("returns localhost when vercel env is not set", () => {
        windowSpy.mockImplementation(() => undefined);

        const baseUrl = helper.getBaseUrl();

        expect(baseUrl).toBe("http://localhost:3000");
    });
});
