import RPi.GPIO as GPIO
import dht11
import time
from picamera2 import Picamera2
import tkinter as tk
from PIL import Image, ImageTk, Image
from datetime import datetime


TEMP_PIN = 17  # Pin del sensor DHT11
SOIL_PIN = 23  # Pin del sensor de humedad de suelo

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(SOIL_PIN, GPIO.IN)


dht11_sensor = dht11.DHT11(pin=TEMP_PIN)

picam2 = Picamera2()
picam2.configure(picam2.create_preview_configuration())


temperatures = []
soil_moisture_readings = []
image_filenames = []


def take_picture():
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    filename = f"/home/Equipo4/Pictures/photo_{timestamp}.jpg"
    picam2.capture_file(filename)
    image_filenames.append(filename)


def read_temperature():
    result = dht11_sensor.read()
    if result.is_valid():
        return result.temperature
    else:
        return 20  


def read_soil_moisture():
    if GPIO.input(SOIL_PIN) == GPIO.HIGH:
        return "Seco"
    else:
        return "Húmedo"


def capture_data():
    for _ in range(24):
        temperature = read_temperature()
        soil_moisture = read_soil_moisture()
        temperatures.append(temperature)
        soil_moisture_readings.append(soil_moisture)
        
        
        label_data.config(text=f"Temperatura: {temperature}°C\nHumedad del suelo: {soil_moisture}")
        
        
        take_picture()
        label_status.config(text="Foto capturada")
        
       
        root.update()
        time.sleep(5)
    
    
    create_gif()

    
    show_final_data()


def create_gif():
    frames = [Image.open(image) for image in image_filenames]
    gif_path = "/home/Equipo4/Pictures/animacion.gif"
    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        duration=500,  
        loop=0
    )
    label_status.config(text=f"GIF creado en: {gif_path}")


def show_final_data():
    final_data = "\n".join([f"Registro {i+1}: Temp: {t}°C, Humedad: {h}" for i, (t, h) in enumerate(zip(temperatures, soil_moisture_readings))])
    label_data.config(text=f"Datos Generados:\n{final_data}")


root = tk.Tk()
root.title("Vista previa de la cámara y datos de sensores")


label_status = tk.Label(root, text="Captura automática en curso")
label_status.pack()


label_data = tk.Label(root, text="Temperatura: --°C\nHumedad del suelo: --")
label_data.pack()


picam2.start()
root.after(100, capture_data)


root.mainloop()


picam2.stop()
GPIO.cleanup()
