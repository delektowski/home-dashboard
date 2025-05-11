from blink_led import GQL_SUCCESS, InternalLed
from env import GQL_URL, PLACE_NAME
from time import sleep
import urequests as requests
import json
from machine import reset
from logger import Logger
import gc 

logger = Logger("send_temperature_logs.txt")

def send_temperature(wdt, temperature: float, humidity = None):
    wdt.feed()
    gc.collect()
    
    gql_url = GQL_URL
    gql_mutation = """
        mutation createMeasuresHome($measuresHomeData: MeasuresHomeInput!) {
            createMeasuresHome(measuresHomeData: $measuresHomeData) {
                placeName
                temperature
                humidity
            }
        }
        """
    gql_variables = {
        "measuresHomeData": {"placeName": PLACE_NAME, "temperature": temperature,"humidity": humidity } }
    payload = {"query": gql_mutation, "variables": gql_variables}
    headers = {"Content-Type": "application/json"}
    payload_json = json.dumps(payload)
    
    response = None
    wdt.feed()
    try:
        response = requests.post(gql_url, data=payload_json, headers=headers)
        wdt.feed()
        
        if response.status_code == 200:
            print("GraphQL mutation successful")
            print(response.text)
            led = InternalLed(GQL_SUCCESS)
            led.blink_led()
        
        else:
            print("GraphQL mutation failed with status code:", response.status_code)
            print(response.text)
            sleep(2)

    except Exception as e:
        print("Send temperature error: ", e)
        logger.log("send_temperature error", e)
        sleep(2)
        raise

    finally:
        if response:
            response.close()
        gc.collect()
