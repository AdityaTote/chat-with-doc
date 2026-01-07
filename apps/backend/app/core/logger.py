import logging
import sys
from pathlib import Path

# Create logs directory if it doesn't exist
log_dir = Path(__file__).parent.parent.parent / "logs"
log_dir.mkdir(exist_ok=True)

# Define log format
LOG_FORMAT = (
    "%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s"
)
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

# Create formatter
formatter = logging.Formatter(LOG_FORMAT, DATE_FORMAT)

# Console handler
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(formatter)

# File handler for all logs
file_handler = logging.FileHandler(log_dir / "app.log")
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(formatter)

# File handler for errors only
error_handler = logging.FileHandler(log_dir / "error.log")
error_handler.setLevel(logging.ERROR)
error_handler.setFormatter(formatter)

# Configure root logger
logging.basicConfig(
    level=logging.DEBUG, handlers=[console_handler, file_handler, error_handler]
)

# Create global logger instance
logger = logging.getLogger("rag-docs")
logger.setLevel(logging.DEBUG)

# Prevent duplicate logs
logger.propagate = False

# Add handlers if not already added
if not logger.handlers:
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    logger.addHandler(error_handler)


def get_logger(name: str = None) -> logging.Logger:
    """
    Get a logger instance with the specified name.

    Args:
        name: Logger name (usually __name__ of the module)

    Returns:
        Logger instance
    """
    if name:
        return logging.getLogger(f"rag-docs.{name}")
    return logger
