from fastapi import Request


def get_pagination(req: Request):
    limit = int(req.query_params.get("limit", 10))
    offset = int(req.query_params.get("offset", 0))
    return limit, offset
