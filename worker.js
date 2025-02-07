addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // If it's an OPTIONS request, handle it immediately:
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    })
  }

  // Construct the target URL for piggy’s endpoint.
  // For example, if your piggy backend is at:
  // https://piggy.rf.gd/valentine/sendEmail.php
  let targetUrl = "https://piggy.rf.gd/valentine/sendEmail.php"

  // Create a new request that targets the piggy endpoint.
  // You can copy the original request's method, headers, and body.
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method === 'GET' || request.method === 'HEAD'
      ? null
      : await request.text(),
    redirect: 'follow'
  })

  // Fetch from piggy’s endpoint.
  const response = await fetch(modifiedRequest)

  // Create new headers to ensure the response is accessible by your frontend.
  const newHeaders = new Headers(response.headers)
  newHeaders.set("Access-Control-Allow-Origin", "*")
  newHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  newHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  })
}
