from os import environ
import logging
import requests
import json
from poll import Poll
from util import str2hex, hex2str

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

# Environment variables setup
rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]  # Rollup HTTP server URL
DAPP_RELAY_ADDRESS = "0xF5DE34d6BbC0446E2a45719E718efEbaaE179daE".lower()

# Global structures
polls = {}
next_poll_id = 0

def add_report(output=""):
    logger.info("Adding report: " + output)
    response = requests.post(f"{rollup_server}/report", json={"payload": str2hex(output)})
    if response.ok:
        logger.info("Report successfully added")
    else:
        logger.error(f"Failed to add report: {response.text}")

def add_notice(data):
    logger.info(f"Adding notice: {data}")
    notice = {"payload": str2hex(data)}
    response = requests.post(f"{rollup_server}/notice", json=notice)
    if response.ok:
        logger.info("Notice successfully added")
    else:
        logger.error(f"Failed to add notice: {response.text}")

def handle_advance(data):
    try:
        payload = json.loads(hex2str(data['payload']))
        method = payload.get("method")
        if method == "create_poll":
            return create_poll(payload)
        elif method == "vote":
            return cast_vote(payload)
        else:
            add_report("Invalid method")
            return "reject"
    except json.JSONDecodeError:
        logger.error("JSON decoding failed")
        return "reject"

def handle_inspect(data):
    logger.info("Handling inspect request.")
    try:
        # Directly using the processed data passed to the function
        output = json.dumps({"polls": [poll.to_dict() for poll in polls.values()]})
        add_report(output)
        return "accept"
    except Exception as e:
        logger.error(f"Failed to generate report from polls data: {str(e)}")
        return "reject"


def create_poll(payload):
    global next_poll_id
    question = payload.get("question")
    options = payload.get("options")
    if not question or not options:
        add_report("Missing question or options")
        return "reject"
    poll = Poll(question, options, next_poll_id)
    polls[next_poll_id] = poll
    next_poll_id += 1
    add_notice(f"Poll with id {poll.id} created.")
    logger.info(f"Poll created with ID {next_poll_id} and status: {polls[next_poll_id].open}")
    return "accept"

def cast_vote(payload):
    logger.info(f"Attempting to cast vote with payload: {payload}")
    poll_id = payload.get("poll_id")
    option = payload.get("option")
    if poll_id not in polls or not polls[poll_id].vote(option):
        add_report("Invalid vote attempt")
        return "reject"
    add_notice(f"Vote cast in poll {poll_id} for option '{option}'")
    return "accept"

while True:
    logger.info("Waiting for new rollup request")
    response = requests.post(f"{rollup_server}/finish", json={"status": "accept"})
    if response.status_code == 202:
        logger.info("No pending rollup request, trying again")
    else:
        rollup_request = response.json()
        data = rollup_request["data"]
        handler = {"advance_state": handle_advance, "inspect_state": handle_inspect}[rollup_request["request_type"]]
        handler(data)
