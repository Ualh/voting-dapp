import logging

# Setting up a logger
logger = logging.getLogger('util')
logging.basicConfig(level=logging.INFO)

def str2hex(s):
    try:
        return "0x" + s.encode("utf-8").hex()
    except UnicodeEncodeError as e:
        logger.error(f"Error encoding string to hex: {str(e)}")
        return None

def hex2str(h):
    try:
        return bytes.fromhex(h[2:]).decode("utf-8")
    except ValueError as e:
        logger.error(f"Error decoding hex to string: {str(e)}")
        return None
