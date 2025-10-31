import page from './page.marko'

declare global {
  namespace Marko {
    interface Global {
      cached: string;
    }
  }
}

export default {
  fetch: async (request, env) => {
    const cached = await env.CACHE.get("test")
    return new Response(page.render({ $global: { cached: cached ?? "not found" } }).toReadable(), {
      headers: { "content-type": "text/html" },
    });
  }
} satisfies ExportedHandler<Env>;
