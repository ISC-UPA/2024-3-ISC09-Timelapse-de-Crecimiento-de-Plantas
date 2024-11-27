import time
import board
import busio
from adafruit_ads1x15.ads1015 import ADS1015  
from adafruit_ads1x15.analog_in import AnalogIn


i2c = busio.I2C(board.SCL, board.SDA)


ads = ADS1015(i2c)  


chan = AnalogIn(ads, 0) 

print("Iniciando lectura del fotorresistor. Presiona Ctrl+C para salir.")
try:
    while True:
       
        voltage = chan.voltage
        raw_value = chan.value  

        print(f"Valor crudo: {raw_value}, Voltaje: {voltage:.2f} V")

      
        time.sleep(0.5)

except KeyboardInterrupt:
    print("\nLectura detenida.")
