import * as Run from "@marko/run/router";

console.log("default-edge-entry");

export default {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    return await Run.fetch(request, {
      env,
      ctx,
    });
  },
}
