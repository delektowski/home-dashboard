from machine import Pin, reset
from send_temperature import send_temperature
from time import sleep, sleep_ms
import onewire
import ds18x20
from logger import Logger
import env
import gc


logger = Logger("get_temperature_logs.txt")

SEND_TEMP_INTERVAL = 900
MAX_TEMP = 50
RESTART_INTERVAL = 10800
CONVERSION_DELAY_MS = 750

# PLACE_NAME is always required. PLACE_NAME_2 is optional and is only used
# when a second DS18x20 sensor is connected to the same bus.
PLACE_NAME = env.PLACE_NAME
PLACE_NAME_2 = getattr(env, "PLACE_NAME_2", None) or None


def get_sensor_names():
    names = [PLACE_NAME]
    if PLACE_NAME_2:
        names.append(PLACE_NAME_2)
    return names


def map_sensors(ds):
    names = get_sensor_names()
    devices = sorted(ds.scan())
    print("Devices found:", [d.hex() for d in devices])

    sensors = list(zip(devices, names))
    for rom, name in sensors:
        print("Sensor '{}' -> {}".format(name, rom.hex()))

    if len(devices) > len(names):
        print(
            "Ignoring extra devices:",
            [d.hex() for d in devices[len(names):]],
        )
        if not PLACE_NAME_2:
            print("Set PLACE_NAME_2 in env.py to use a second sensor")

    if not sensors:
        raise Exception("No DS18x20 sensors found on GP27")

    if len(sensors) < len(names):
        print(
            "Warning: expected {} sensors, found {}".format(
                len(names), len(sensors)
            )
        )

    return sensors


def get_temp_ds18x20(wdt):
    wdt.feed()
    time_elapsed = 0
    first_run = True
    time_until_restart = RESTART_INTERVAL

    gc.collect()

    try:
        ow = onewire.OneWire(Pin(27))
        ds = ds18x20.DS18X20(ow)
        sensors = map_sensors(ds)

        while True:
            wdt.feed()
            if time_elapsed >= SEND_TEMP_INTERVAL or first_run:
                gc.collect()
                # Starts conversion on all devices on the bus at once.
                ds.convert_temp()
                sleep_ms(CONVERSION_DELAY_MS)
                wdt.feed()

                for rom, name in sensors:
                    wdt.feed()
                    try:
                        temp_rounded = round(ds.read_temp(rom), 2)
                    except Exception as e:
                        print("Read error for '{}': {}".format(name, e))
                        logger.log("read_temp error for '{}': {}".format(name, e), "get_temp_ds18x20")
                        continue

                    print("'{}' temperature: {}".format(name, temp_rounded))

                    if temp_rounded <= MAX_TEMP:
                        send_temperature(wdt, temp_rounded, place_name=name)
                        wdt.feed()
                    else:
                        print(
                            f"Temperature {temp_rounded}°C exceeds maximum threshold of {MAX_TEMP}°C - not sending ('{name}')"
                        )

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
        logger.log("get_temp error: {}".format(e), "get_temp_ds18x20")
        sleep(9)
