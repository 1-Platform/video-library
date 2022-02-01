// src/mocks/handlers.js
import { rest } from "msw";
export const handlers = [
  // Handles a PST /login request
  rest.post("http://localhost:8080/graphql", async (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
