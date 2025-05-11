from machine import Pin, reset
from send_current_temperature import send_current_temperature
from send_temperature import send_temperature
from time import sleep
import dht 
from logger import Logger
import gc 
 

logger = Logger("get_temperature_logs.txt")

SEND_TEMP_INTERVAL = 1800 
SEND_CURRENT_TEMP_INTERVAL = 60  # 
MAX_TEMP = 50
RESTART_INTERVAL = 10800  

def get_temp(wdt):
    wdt.feed()
    logger.log("Get_TEMP")
    time_elapsed = 0
    time_elapsed_current = 0
    first_run = True
    time_until_restart = RESTART_INTERVAL
    
    gc.collect()
    
    try:
        pin = Pin(16, Pin.OUT, Pin.PULL_DOWN)
        logger.log("pin")
        sensor = dht.DHT11(pin)
        logger.log("sensor")
        sleep(2)
        logger.log("after_sleep")
        
        
        while True:
            wdt.feed()
            logger.log("whle")
            if time_elapsed_current >= SEND_CURRENT_TEMP_INTERVAL or first_run:
                logger.log("1_if")
                gc.collect()
                sensor.measure()
                wdt.feed()
                temp = sensor.temperature()
                hum = sensor.humidity()
                
                temp_rounded = round(temp, 2)
                print("Temperature: {}".format(temp_rounded))  
                
                if temp_rounded <= MAX_TEMP:
                    logger.log("1_ifSUB")
                    send_current_temperature(wdt, temp_rounded, hum)
                    wdt.feed()
                    time_elapsed_current = 0
                
                else:
                    print(f"Temperature {temp_rounded}°C exceeds maximum threshold of {MAX_TEMP}°C - not sending")
                    continue
            
            if time_elapsed >= SEND_TEMP_INTERVAL or first_run:
                    logger.log("2_if")
                    wdt.feed()
                    send_temperature(wdt, temp_rounded, hum)
                    wdt.feed()
                    first_run = False
                    time_elapsed = 0
       
            if time_until_restart <= 0:
                logger.log("3_if")
                print("Performing scheduled restart...")
                logger.log("get_temp","Restarting...")
                reset()     
                   
            time_elapsed_current += 1
            time_elapsed += 1
            time_until_restart -= 1
            wdt.feed()
            logger.log("after_if")
            sleep(1)
                         
    except Exception as e:
        print("get_temp error: ", e)
        logger.log("get_temp error: ", e)
        sleep(9)