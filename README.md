# API Project: URL Shortener Microservice

This api provides a simple url shortener.

## Features

1. Posting a URL to `[project_url]/api/shorturl/new` will return a shortened URL in the JSON response.
   Example: `{"original_url":"www.google.com","short_url":1}`
2. Posting an invalid URL that does not follow the http(s)://www.example.com(/more/routes) format, will return a JSON response like `{"error":"invalid URL"}`
3. Visiting the shortened URL, will redirect to the original link.

[Demo](https://oy7br.sse.codesandbox.io/)
