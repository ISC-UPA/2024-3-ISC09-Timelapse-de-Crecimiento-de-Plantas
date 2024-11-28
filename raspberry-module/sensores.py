from picamera2 import Picamera2
import time
from dht11 import DHT11
import RPi.GPIO as GPIO

dht_sensor = DHT11(pin=17)


SOIL_MOISTURE_PIN = 23

picam2 = Picamera2()
picam2.configure(picam2.create_still_configuraion())

GPIO.setmode(GPIO.BMC)
GPIO.setup(SOIL_MOISTURE_PIN, GPIO.IN)

try:
    while True:
        
        result = dht_sensor.read()
        if result.is_valid():
            temperature = result.temperature
            print(f"Temperatura: {temperature: .1f} C")
        else:
            print("Error en el sensor de temperaura")
        
        
        if GPIO.input(SOIL_MOISTURE_PIN):
            print("Tierra seca")
        else:
            print("Tierra humeda")
            
            
        timestamp = time.strftime("%Y%m%d-%H%M%S")
        picam2.capture_file(f"/home/pi/image_{timestamp}.jpg")
        print(f"foto tomada: imagen_{timestamp}.jpg")
        
        time.sleep(10)
        
        
except KeyboardInterrupt:
    print("Programa detenido")
finally:
    GPIO.cleanup()
    picam2.close()
        