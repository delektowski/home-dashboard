from machine import RTC

def set_time():
    rtc = RTC()
    # Set date and time (year, month, day, weekday, hours, minutes, seconds, subseconds)
    rtc.datetime((1970, 1, 1, 0, 0, 0, 0, 0))
    
def get_formatted_time():
    rtc = RTC()
    dt = rtc.datetime()
    return f"{dt[0]}-{dt[1]:02d}-{dt[2]:02d} {dt[4]:02d}:{dt[5]:02d}:{dt[6]:02d}"