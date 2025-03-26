from time import sleep
import machine

GQL_SUCCESS = "GQL_SUCCESS"
WIFI_SUCCESS = "WIFI_SUCCESS"


class InternalLed:
    def __init__(self, blink_type) -> None:
        self.blink_type = blink_type

    def set_blink_type(self):
        default = (1, 1)
        wifi_success = (1, 0.2)
        gql_success = (1, 2)

        if self.blink_type == GQL_SUCCESS:
            return {"freq": gql_success[0], "duration": gql_success[1]}
        if self.blink_type == WIFI_SUCCESS:
            return {"freq": wifi_success[0], "duration": wifi_success[1]}
        else:
            pass

    def blink_led(self):
        led = machine.Pin("LED", machine.Pin.OUT)
        blink = self.set_blink_type()


        for i in range(blink["freq"]):
            led.on()
            sleep(blink["duration"])
            led.off()
