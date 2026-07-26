export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404 || !['GET', 'HEAD'].includes(request.method)) {
      return response
    }

    const url = new URL(request.url)
    if (url.pathname.endsWith('/')) {
      const directoryIndex = new URL(url)
      directoryIndex.pathname += 'index.html'
      const directoryResponse = await env.ASSETS.fetch(new Request(directoryIndex, request))
      if (directoryResponse.status !== 404) return directoryResponse
    }

    if (!request.headers.get('accept')?.includes('text/html')) return response

    const indexUrl = new URL(url)
    indexUrl.pathname = '/index.html'
    indexUrl.search = ''
    return env.ASSETS.fetch(new Request(indexUrl, request))
  },
}
