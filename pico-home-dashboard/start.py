from blink_led import GQL_SUCCESS, WIFI_SUCCESS, InternalLed
import network
from env import SENSOR_TYPE
from time import sleep
from env import SSID, PASSWORD
from logger import Logger
from timer import set_time
import gc  
     
from machine import WDT

logger = Logger("main_logs.txt")

ssid = SSID
password = PASSWORD
wdt = None

wdt = WDT(timeout=8387)

def connect():
    try:
        gc.enable()
        gc.threshold(4096)
        gc.collect()
        wdt.feed()
        
        wlan = network.WLAN(network.STA_IF)
        wlan.active(True)
        wlan.connect(ssid, password)
        handle_connection(wlan)
    except Exception as e:
        print("connect error: ", e)
        logger.log("connect error", e)
        wdt.feed()
        sleep(5)
        wdt.feed()
        connect()


def handle_connection(wlan):
    retry_connect = 0
    while wlan.isconnected() == False:
        print("Waiting for connection...")
        wdt.feed()
        sleep(1)
        wdt.feed()
        retry_connect += 1
        if retry_connect > 20:
            retry_connect = 0
            wdt.feed()
            connect()
            
        
    ip = wlan.ifconfig()[0]
    connect_msg = f"Connected to ip: {ip}"
    free_mem = gc.mem_free()
    print(connect_msg)
    set_time()
    logger.log("handle_connection",connect_msg)
    logger.log("handle_connection","Free memory: " + str(free_mem))
    wdt.feed()
    led = InternalLed(WIFI_SUCCESS)
    wdt.feed()
    print("LED ON")
    logger.log("LED ON")
    led.blink_led()
    wdt.feed()
    logger.log("LED OFF")
    
    gc.collect()

    try:
        print("Getting temperature...")
        wdt.feed()
        handle_sensor_type()
    except Exception as e:
        free_mem = gc.mem_free()
        print("Handle connection error: ", e)
        logger.log("handle_connection error",str(e))
        logger.log("handle_connection error","Free memory: " + str(free_mem))
        wdt.feed()
        sleep(5)
        wdt.feed()
        connect()
        
def handle_sensor_type():
    try:
        sensor_type = SENSOR_TYPE
        if sensor_type == "DHT11":
            from get_temperature_dht11 import get_temp_dht11
            get_temp_dht11(wdt)
        elif sensor_type == "DS18X20":
            from get_temp_ds18x20 import get_temp_ds18x20
            get_temp_ds18x20(wdt)
        else:
            print("Invalid sensor type")
    except Exception as e:
        free_mem = gc.mem_free()
        print("Sensor type error: ", e)
        logger.log("Sensor type error", str(e))
        logger.log("Sensor type error","Free memory: " + str(free_mem))

try:
    connect()
    
except Exception as e:
    free_mem = gc.mem_free()
    print("Connection interruption error: ", e)
    logger.log("Connection interruption error", str(e)) 
    logger.log("Connection interruption error","Free memory: " + str(free_mem))
    wdt.feed()
    sleep(5)
    wdt.feed()
    connect()



