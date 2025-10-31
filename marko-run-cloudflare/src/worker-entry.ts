import * as Run from "@marko/run/router";

export default {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    return await Run.fetch(request, {
      env,
      ctx,
    });
  },
}
