from blink_led import GQL_SUCCESS, WIFI_SUCCESS, InternalLed
from get_temperature import get_temp
import network
from send_current_temperature import send_current_temperature
from time import sleep
from env import SSID, PASSWORD
from logger import Logger
from timer import set_time

logger = Logger("logs/main_logs.txt")

ssid = SSID
password = PASSWORD

def connect():
    try:
        wlan = network.WLAN(network.STA_IF)
        wlan.active(True)
        wlan.connect(ssid, password)
        handle_connection(wlan)
    except Exception as e:
        print("connect error: ", e)
        logger.log("connect error", error_msg)
        sleep(10)
        connect()


def handle_connection(wlan):
    while wlan.isconnected() == False:
        print("Waiting for connection...")
        sleep(1)
    ip = wlan.ifconfig()[0]
    connect_msg = f"Connected to ip: {ip}"
    print(connect_msg)
    set_time()
    logger.log("handle_connection",connect_msg)
    led = InternalLed(WIFI_SUCCESS)
    led.blink_led()

    try:
        get_temp()
    except Exception as e:
        sleep(2)
        print("Handle connection error: ", e)
        logger.log("handle_connection error",e)
        connect()

try:
    connect()
except Exception as e:
    sleep(10)
    print("Connection interruption error: ", e)
    logger.log("Connection interruption error",e)
    connect()

