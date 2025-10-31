declare module "@marko/run" {
    interface Platform {
        env: Cloudflare.Env;
    }
    interface Context {
        cached: string;
    }
}

export const GET = (async (context, next) => {
    const cacheEntry = await context.platform.env.CACHE.get("test")
    context.cached = cacheEntry ?? "not found"
    return await next();
}) satisfies MarkoRun.Handler;

export const POST = (async (context, next) => {
    const formData = await context.request.formData();
    const cached = formData.get("cached")?.toString() ?? ""
    await context.platform.env.CACHE.put("test", cached)
    return context.back()
}) satisfies MarkoRun.Handler;