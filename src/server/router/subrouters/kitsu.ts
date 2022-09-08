import { z } from "zod";
import { createProtectedRouter } from "../protected-router";
import { getImageByTitle } from "../../utils/kitsu";

export const kitsuRouter = createProtectedRouter().query("get-imageByTitle", {
    input: z.object({
        title: z.string(),
    }),
    resolve: async ({ input }) => {
        return await getImageByTitle(input.title);
    },
});
