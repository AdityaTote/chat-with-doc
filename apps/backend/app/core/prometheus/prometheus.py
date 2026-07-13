from prometheus_client import Counter, Histogram, Gauge

http_requests_total = Counter(
    "http_requests_total", "Total HTTP requests", ["method", "route", "status"]
)

http_request_duration = Histogram(
    "http_request_duration_seconds",
    "HTTP request latency",
    ["route"],
    buckets=(0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10),
)

active_request = Gauge("http_requests_in_flight", "In-flight HTTP requests")
