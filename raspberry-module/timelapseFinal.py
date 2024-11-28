import os
import time
import requests
from datetime import datetime
from azure.storage.blob import BlobClient
from PIL import Image
from picamera2 import Picamera2
import tkinter as tk
import RPi.GPIO as GPIO
import dht11
import board
import busio
import uuid
from adafruit_ads1x15.ads1015 import ADS1015 
from adafruit_ads1x15.analog_in import AnalogIn

# Configuración de los pines GPIO
TEMP_PIN = 17  # Pin del sensor DHT11
SOIL_PIN = 23  # Pin del sensor de humedad de suelo


directorio_imagenes = "/home/Equipo4/Pictures/"


sas_url = "https://plantguardstorage.blob.core.windows.net/fotos"
sas_token = "?sp=racwd&st=2024-11-20T16:45:49Z&se=2024-12-21T00:45:49Z&sv=2022-11-02&sr=c&sig=fk%2Fcq57hWMHf%2FzM%2Bi2MLWdy8Tqbb%2F8%2BBEVPl8plG%2FVQ%3D"

mutation_create_measurement = """
mutation CreateMeasurement($data: MeasurementCreateInput!) {
  createMeasurement(data: $data) {
    id
  }
}
"""

mutation_create_image = """
mutation CreateImage($data: UrlImageCreateInput!) {
  createUrlImage(data: $data) {
    id
  }
}
"""

url = "https://plantguard-api-dxa3f9ftg7h2fwf4.eastus-01.azurewebsites.net/api/graphql"


GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(SOIL_PIN, GPIO.IN)


dht11_sensor = dht11.DHT11(pin=TEMP_PIN)


picam2 = Picamera2()
picam2.configure(picam2.create_preview_configuration())


measurements_ids = []
image_filenames = []

i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS1015(i2c)  
chan = AnalogIn(ads, 0)

def read_light():
    voltage = chan.voltage
    raw_value = chan.value  

    print(f"Valor crudo: {raw_value}, Voltaje: {voltage:.2f} V")
    
    return raw_value
    


def take_picture():
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    filename = f"{directorio_imagenes}photo_{timestamp}.jpg"
    picam2.capture_file(filename)
    image_filenames.append(filename)
    
    return filename


def read_temperature():
    result = dht11_sensor.read()
    if result.is_valid():
        return result.temperature
    else:
        return 23.5  


def read_soil_moisture():
    return "Húmedo" if GPIO.input(SOIL_PIN) == GPIO.LOW else "Seco"


def send_measurement(temperature, soil_moisture, imageId, light_value):
    soil_moisture_value = 1 if soil_moisture == "Húmedo" else 0
    variables = {
        "data": {
            "humidity": soil_moisture_value,
            "light": light_value,
            "temperature": temperature,
            "image": {"connect": {"id": imageId}}  
        }
    }
    payload = {"query": mutation_create_measurement, "variables": variables}
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        data = response.json()
        measurement_id = data["data"]["createMeasurement"]["id"]
        measurements_ids.append(measurement_id)
        print(f"Medición creada con ID: {measurement_id}")
    else:
        print(f"Error al enviar los datos: {response.status_code}")
        print(response.text)



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
        print("GIF subido exitosamente a Blob Storage.")

      
        image_url = f"https://plantguardstorage.blob.core.windows.net/fotos/{nombre_blob}"
        print(f"URL del GIF: {image_url}")

       
        os.remove(ruta_imagen)
        print(f"GIF local eliminado: {ruta_imagen}")

        return image_url

    except Exception as e:
        print(f"Ocurrió un error al subir el GIF: {e}")
        return None



def create_image_object(image_url):
    variables = {
        "data": {
            "url_image": image_url
        }
    }
    payload = {"query": mutation_create_image, "variables": variables}
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        data = response.json()
        image_id = data["data"]["createUrlImage"]["id"]
        print(f"Imagen creada con ID: {image_id}")
        return image_id
    else:
        print(f"Error al crear la imagen: {response.status_code}")
        print(response.text)
        return None



def capture_data():
    

   
    for _ in range(24):
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        imageNameId = uuid.uuid4()
        gif_filename = f"{timestamp}_{imageNameId}.jpg"
        gif_path = f"{directorio_imagenes}{gif_filename}"
        temperature = read_temperature()
        soil_moisture = read_soil_moisture()
        light_value = read_light()
        gif_path = take_picture()
        gif_url = subir_imagen_a_blob(gif_path, gif_filename)
        image_id = create_image_object(gif_url)
        send_measurement(temperature, soil_moisture, image_id, light_value)  # Envia las mediciones
        time.sleep(2)


root = tk.Tk()
root.title("Vista previa de la cámara y datos de sensores")
label_status = tk.Label(root, text="Captura automática en curso")
label_status.pack()
picam2.start()
root.after(100, capture_data)
root.mainloop()
picam2.stop()
GPIO.cleanup()

