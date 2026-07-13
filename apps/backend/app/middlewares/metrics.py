import time
from fastapi import Request
from typing import Awaitable, Callable
from starlette.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.prometheus import http_request_duration, active_request, http_requests_total

class MetricMiddleware(BaseHTTPMiddleware):
  async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
    route = request.url.path
    if route != "/metrics":
      active_request.inc
      method = request.method

      start = time.time()
      
      try:
        response = await call_next(request)
        status_code = response.status_code
        return response
      
      finally:
        duration = time.time() - start

        http_requests_total.labels(method, route, status_code).inc()
        http_request_duration.labels(route).observe(duration)
        active_request.dec()
    
    return await call_next(request)