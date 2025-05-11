from blink_led import GQL_SUCCESS, InternalLed
from env import GQL_URL, PLACE_NAME
from time import sleep
import urequests as requests
import json
from machine import reset
from logger import Logger
import gc 

logger = Logger("send_current_temp_logs.txt")


def send_current_temperature(wdt, temperature: float, humidity=0.0):
    gc.collect()
    wdt.feed()
    gql_url = GQL_URL
    gql_mutation = """
        mutation createCurrentMeasuresHome($measuresHomeData: MeasuresHomeInput!) {
            createCurrentMeasuresHome(measuresHomeData: $measuresHomeData) {
                placeName
                temperature
                humidity
            }
        }
        """
    gql_variables = {
        "measuresHomeData": {"placeName": PLACE_NAME, "temperature": temperature,"humidity": humidity }
    }
    payload = {"query": gql_mutation, "variables": gql_variables}
    headers = {"Content-Type": "application/json"}
    payload_json = json.dumps(payload)
    
    response = None
    
    try:
        wdt.feed()
        logger.log("BEFORE RESPONSE")
        response = requests.post(gql_url, data=payload_json, headers=headers)
        logger.log("AFTER RESPONSE")
        wdt.feed()
        
        if response.status_code == 200:
            print("GraphQL mutation successful")
            print(response.text)
            led = InternalLed(GQL_SUCCESS)
            wdt.feed()
            led.blink_led()
            wdt.feed()

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
        if response:
            response.close()
        gc.collect()
