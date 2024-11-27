import RPi.GPIO as GPIO
import dht11
import time
import requests
from picamera2 import Picamera2
import tkinter as tk
from PIL import Image, ImageTk
from datetime import datetime
from azure.storage.blob import BlobClient
import os


TEMP_PIN = 17  
SOIL_PIN = 23  


directorio_imagenes = "/home/Equipo4/Pictures/"


sas_url = "https://plantguardstorage.blob.core.windows.net/fotos"
sas_token = "?sp=racwd&st=2024-11-20T16:45:49Z&se=2024-12-21T00:45:49Z&sv=2022-11-02&sr=c&sig=fk%2Fcq57hWMHf%2FzM%2Bi2MLWdy8Tqbb%2F8%2BBEVPl8plG%2FVQ%3D"


url = "https://plantguard-api-dxa3f9ftg7h2fwf4.eastus-01.azurewebsites.net/api/graphql"
mutation = """
mutation CreateMeasurement($data: MeasurementCreateInput!) {
  createMeasurement(data: $data) {
    id
  }
}
"""


GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(SOIL_PIN, GPIO.IN)


dht11_sensor = dht11.DHT11(pin=TEMP_PIN)


picam2 = Picamera2()
picam2.configure(picam2.create_preview_configuration())


temperatures = []
soil_moisture_readings = []
image_filenames = []

def subir_imagen_a_blob(ruta_imagen, nombre_blob):
    try:
        blob_client = BlobClient(
            account_url="https://plantguardstorage.blob.core.windows.net",  
            container_name="fotos",  
            blob_name=nombre_blob,
            credential=sas_token  
        )

        
        with open(ruta_imagen, "rb") as data:
            blob_client.upload_blob(data, overwrite=True)
        print("Imagen subida exitosamente a Blob Storage.")

        
        os.remove(ruta_imagen)
        print(f"Imagen local eliminada: {ruta_imagen}")

    except Exception as e:
        print(f"Ocurrió un error al subir la imagen: {e}")



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
        return 23.5  


def read_soil_moisture():
    return "Húmedo" if GPIO.input(SOIL_PIN) == GPIO.LOW else "Seco"


def send_measurement(temperature, soil_moisture):
   
    soil_moisture_value = 1 if soil_moisture == "Húmedo" else 0
    variables = {
        "data": {
            "humidity": soil_moisture_value,
            "light": 100,  
            "temperature": temperature
        }
    }
    payload = {
        "query": mutation,
        "variables": variables
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        print("Datos enviados con éxito:", response.json())
    else:
        print(f"Error al enviar los datos: {response.status_code}")
        print(response.text)


def capture_data():
    for _ in range(24):
        temperature = read_temperature()
        soil_moisture = read_soil_moisture()
        temperatures.append(temperature)
        soil_moisture_readings.append(soil_moisture)

        
        label_data.config(text=f"Temperatura: {temperature}°C\nHumedad del suelo: {soil_moisture}")

        
        take_picture()
        label_status.config(text="Foto capturada")

       
        send_measurement(temperature, soil_moisture)

        
        root.update()
        time.sleep(2)

   
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


timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
nombre_imagen = f"{directorio_imagenes}animacion.gif"
nombre_blob = f"{timestamp}animacion.gif"

subir_imagen_a_blob(nombre_imagen, nombre_blob)



picam2.stop()
GPIO.cleanup()
