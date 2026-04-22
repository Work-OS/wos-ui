import { NextRequest } from "next/server"

const BACKEND_API_BASE =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8081/api"

function buildTargetUrl(path: string[], requestUrl: string) {
  const base = BACKEND_API_BASE.endsWith("/")
    ? BACKEND_API_BASE.slice(0, -1)
    : BACKEND_API_BASE
  const pathname = path.join("/")
  const incoming = new URL(requestUrl)
  return `${base}/${pathname}${incoming.search}`
}

function buildForwardHeaders(request: NextRequest) {
  const headers = new Headers(request.headers)

  // Upstream host and content size are recomputed by fetch.
  headers.delete("host")
  headers.delete("content-length")

  // If browser didn't include Authorization, derive it from access_token cookie.
  if (!headers.get("authorization")) {
    const accessToken = request.cookies.get("access_token")?.value
    if (accessToken) headers.set("authorization", `Bearer ${accessToken}`)
  }

  return headers
}

function buildResponseHeaders(upstream: Response) {
  const headers = new Headers(upstream.headers)

  // Hop-by-hop headers must not be forwarded by proxies.
  headers.delete("connection")
  headers.delete("keep-alive")
  headers.delete("proxy-authenticate")
  headers.delete("proxy-authorization")
  headers.delete("te")
  headers.delete("trailer")
  headers.delete("transfer-encoding")
  headers.delete("upgrade")
  headers.set("x-wos-proxy", "next-api-route")

  return headers
}

function isNullBodyStatus(status: number) {
  return status === 204 || status === 205 || status === 304
}

async function proxy(request: NextRequest, path: string[]) {
  try {
    const targetUrl = buildTargetUrl(path, request.url)
    const method = request.method.toUpperCase()

    const init: RequestInit = {
      method,
      headers: buildForwardHeaders(request),
      redirect: "manual",
      cache: "no-store",
    }

    if (method !== "GET" && method !== "HEAD") {
      const body = await request.arrayBuffer()
      if (body.byteLength > 0) init.body = body
    }

    const upstream = await fetch(targetUrl, init)
    const headers = buildResponseHeaders(upstream)

    if (isNullBodyStatus(upstream.status)) {
      headers.delete("content-length")
      headers.delete("content-type")
      return new Response(null, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers,
      })
    }

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers,
    })
  } catch (error) {
    console.error("API proxy error", {
      path: `/${path.join("/")}`,
      method: request.method,
      error,
    })
    return Response.json({ error: "Proxy forwarding failed" }, { status: 502 })
  }
}

type RouteContext = { params: Promise<{ path: string[] }> }

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxy(request, path)
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxy(request, path)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxy(request, path)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxy(request, path)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxy(request, path)
}

export async function OPTIONS(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  return proxy(request, path)
}
