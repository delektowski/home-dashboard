from blink_led import GQL_SUCCESS, WIFI_SUCCESS, InternalLed
from get_temperature import get_temp
import network
from send_current_temperature import send_current_temperature
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
    print("BEFORE retry_connect: ", retry_connect)
    logger.log("BEFORE retry_connect", str(retry_connect))
    while wlan.isconnected() == False:
        print("WHILE retry_connect: ", retry_connect)
        logger.log("12WHILE retry_connect", str(retry_connect))
        print("Waiting for connection...")
        wdt.feed()
        sleep(1)
        wdt.feed()
        retry_connect += 1
        if retry_connect > 20:
            logger.log("CONNCCECT WHILE ", str(retry_connect))
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
        logger.log("Getting temperature...")
        wdt.feed()
        get_temp(wdt)
    except Exception as e:
        free_mem = gc.mem_free()
        print("Handle connection error: ", e)
        logger.log("handle_connection error",str(e))
        logger.log("handle_connection error","Free memory: " + str(free_mem))
        wdt.feed()
        sleep(5)
        wdt.feed()
        connect()

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



