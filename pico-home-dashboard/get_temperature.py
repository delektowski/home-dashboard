from machine import Pin, reset
from send_current_temperature import send_current_temperature
from send_temperature import send_temperature
from time import sleep
import onewire
import ds18x20
from logger import Logger
 

logger = Logger("logs/get_temperature_logs.txt")

SEND_TEMP_INTERVAL = 1800 
SEND_CURRENT_TEMP_INTERVAL = 60  # 
MAX_TEMP = 50
RESTART_INTERVAL = 43200  

def get_temp():
    time_elapsed = 0
    first_run = True
    time_until_restart = RESTART_INTERVAL
    
    try:
        ow = onewire.OneWire(Pin(27))
        ds = ds18x20.DS18X20(ow)
        devices = ds.scan()
        print('Device has been found:', devices)
        
        while True:
            ds.convert_temp()
            temp_rounded = round(ds.read_temp(devices[0]), 2)
            print("Temperature: {}".format(temp_rounded))  
            
            if temp_rounded <= MAX_TEMP:
                send_current_temperature(temp_rounded)
                
                if time_elapsed >= SEND_TEMP_INTERVAL or first_run:
                    send_temperature(temp_rounded)
                    time_elapsed = 0
                    first_run = False
            else:
                print(f"Temperature {temp_rounded}°C exceeds maximum threshold of {MAX_TEMP}°C - not sending")
            
            time_elapsed += SEND_CURRENT_TEMP_INTERVAL
            time_until_restart -= SEND_CURRENT_TEMP_INTERVAL
            
            if time_until_restart <= 0:
                print("Performing scheduled restart...")
                logger.log("get_temp","Restarting...")
                sleep(2)
                reset()
                
            sleep(SEND_CURRENT_TEMP_INTERVAL)
                          
    except Exception as e:
        print("get_temp error: ", e)
        logger.log("get_temp error: ", e)
        sleep(2)
        raise 