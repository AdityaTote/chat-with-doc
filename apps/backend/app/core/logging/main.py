import logging
import json
from enum import StrEnum

LOG_FORMAT_DEBUG = "%(levelname)s:%(message)s:%(pathname)s:%(funcName)s:%(lineno)d"


class LogLevel(StrEnum):
    info = "INFO"
    warning = "WARNING"
    error = "ERROR"
    debug = "DEBUG"


LEVEL_MAP = {
    LogLevel.debug: logging.DEBUG,
    LogLevel.info: logging.INFO,
    LogLevel.warning: logging.WARNING,
    LogLevel.error: logging.ERROR,
}


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        return json.dumps({
            "asctime": self.formatTime(record),
            "levelname": record.levelname,
            "name": record.name,
            "message": record.getMessage(),
        })


def load_log_config(log_level: str = LogLevel.error):
    """
    Configure logging for the application.
    Uses JSON logs for INFO and WARNING, plain for ERROR, DEBUG has extra info.
    """
    log_level = log_level.upper()
    logger = logging.getLogger()

    if logger.hasHandlers():
        logger.handlers.clear()

    try:
        log_level_enum = LogLevel(log_level)
    except ValueError:
        log_level_enum = LogLevel.error

    level = LEVEL_MAP.get(log_level_enum, logging.ERROR)
    handler = logging.StreamHandler()

    if log_level_enum == LogLevel.debug:
        formatter = logging.Formatter(LOG_FORMAT_DEBUG)
    elif log_level_enum == LogLevel.error:
        formatter = logging.Formatter("%(levelname)s:%(message)s")
    else:
        formatter = JsonFormatter()

    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(level)