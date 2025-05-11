from machine import Pin, reset
from send_current_temperature import send_current_temperature
from send_temperature import send_temperature
from time import sleep
import dht
from logger import Logger
import gc


logger = Logger("get_temperature_logs.txt")

SEND_TEMP_INTERVAL = 900
MAX_TEMP = 50
RESTART_INTERVAL = 10800


def get_temp(wdt):
    wdt.feed()
    time_elapsed = 0
    first_run = True
    time_until_restart = RESTART_INTERVAL

    gc.collect()

    try:
        pin = Pin(16, Pin.OUT, Pin.PULL_DOWN)
        sensor = dht.DHT11(pin)
        sleep(2)

        while True:
            wdt.feed()
            if time_elapsed >= SEND_TEMP_INTERVAL or first_run:
                gc.collect()
                sensor.measure()
                wdt.feed()
                temp = sensor.temperature()
                hum = sensor.humidity()
                temp_rounded = round(temp, 2)
                print("Temperature: {}".format(temp_rounded))

                if temp_rounded <= MAX_TEMP:
                    send_temperature(wdt, temp_rounded, hum)
                    wdt.feed()

                else:
                    print(
                        f"Temperature {temp_rounded}°C exceeds maximum threshold of {MAX_TEMP}°C - not sending"
                    )
                    continue
               
                wdt.feed()
                first_run = False
                time_elapsed = 0

            if time_until_restart <= 0:
                reset()

            time_elapsed += 1
            time_until_restart -= 1
            wdt.feed()
            sleep(1)

    except Exception as e:
        print("get_temp error: ", e)
        logger.log("get_temp error: ", e)
        sleep(9)
