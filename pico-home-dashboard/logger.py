import os
from timer import get_formatted_time

class Logger:
    def __init__(self, filename="log.txt"):
        self.filename = filename
        
    def log(self, message, def_name = "unknown"):
        timestamp = get_formatted_time()
        formatted_msg = f"[{timestamp}] [{def_name}] {message}"
        
        try:
            with open(self.filename, "a") as file:
                file.write(formatted_msg + "\n")
        except:
            # If writing fails, try creating the file
            with open(self.filename, "w") as file:
                file.write(formatted_msg + "\n")
    
    def clear_log(self):
        with open(self.filename, "w") as file:
            file.write("")