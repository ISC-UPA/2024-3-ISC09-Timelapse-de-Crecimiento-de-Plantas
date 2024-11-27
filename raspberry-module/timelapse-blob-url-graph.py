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


def take_picture():
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    filename = f"{directorio_imagenes}photo_{timestamp}.jpg"
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
            "temperature": temperature,
            "image": None 
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


def create_gif():
    frames = [Image.open(image) for image in image_filenames]
    gif_path = f"{directorio_imagenes}animacion.gif"
    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        duration=500,  
        loop=0
    )
    print(f"GIF creado en: {gif_path}")
    return gif_path


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

    
        gif_url = f"https://plantguardstorage.blob.core.windows.net/fotos/{nombre_blob}"
        print(f"URL del GIF: {gif_url}")

       
        os.remove(ruta_imagen)
        print(f"GIF local eliminado: {ruta_imagen}")

        return gif_url

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
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    gif_filename = f"{timestamp}_animacion.gif"
    gif_path = f"{directorio_imagenes}{gif_filename}"

 
    for _ in range(24):
        temperature = read_temperature()
        soil_moisture = read_soil_moisture()
        send_measurement(temperature, soil_moisture)
        take_picture()
        time.sleep(2)

   
    gif_path = create_gif()
    gif_url = subir_imagen_a_blob(gif_path, gif_filename)
    print(f"Enlazando mediciones con la imagen ID: {gif_url}")
   
    if gif_url:
        print(f"GIF subido con URL: {gif_url}")

       
        image_id = create_image_object(gif_url)
        if image_id:
            print(f"Enlazando mediciones con la imagen ID: {image_id}")


root = tk.Tk()
root.title("Vista previa de la cámara y datos de sensores")
label_status = tk.Label(root, text="Captura automática en curso")
label_status.pack()
picam2.start()
root.after(100, capture_data)
root.mainloop()
picam2.stop()
GPIO.cleanup()
