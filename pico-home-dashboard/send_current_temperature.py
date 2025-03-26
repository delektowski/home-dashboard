from blink_led import GQL_SUCCESS, InternalLed
from env import GQL_URL, PLACE_NAME
from time import sleep
import urequests as requests
import json
from machine import reset
from logger import Logger

logger = Logger("logs/send_current_temp_logs.txt")


def send_current_temperature(temperature: float, pressure=0.0, humidity=0.0):
    
    gql_url = GQL_URL
    gql_mutation = """
        mutation createCurrentMeasuresHome($measuresHomeData: MeasuresHomeInput!) {
            createCurrentMeasuresHome(measuresHomeData: $measuresHomeData) {
                placeName
                temperature
            }
        }
        """
    gql_variables = {
        "measuresHomeData": {"placeName": PLACE_NAME, "temperature": temperature}
    }
    payload = {"query": gql_mutation, "variables": gql_variables}
    headers = {"Content-Type": "application/json"}
    payload_json = json.dumps(payload)
    
    try:
        response = requests.post(gql_url, data=payload_json, headers=headers)
        
        if response.status_code == 200:
            print("GraphQL mutation successful")
            print(response.text)
            led = InternalLed(GQL_SUCCESS)
            led.blink_led()

        else:
            print("GraphQL mutation failed with status code:", response.status_code)
            print(response.text)
            logger.log("send_current_temperature error", response.text)
            sleep(2)

    except Exception as e:
        print("send current temperature error: ", e)
        logger.log("send_current_temperature error", e)
        sleep(2)
        raise

    finally:
        if 'response' in locals():
            response.close()
