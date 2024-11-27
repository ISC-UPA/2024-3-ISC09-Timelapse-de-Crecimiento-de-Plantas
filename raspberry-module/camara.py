from picamera2 import Picamera2
import tkinter as tk
from PIL import Image, ImageTk
import time


picam2 = Picamera2()


picam2.configure(picam2.create_preview_configuration())


def update_preview():
    frame = picam2.capture_array()
    frame = Image.fromarray(frame)
    frame_tk = ImageTk.PhotoImage(image=frame)
    label.config(image=frame_tk)
    label.image = frame_tk
    root.after(10, update_preview)


root = tk.Tk()
root.title("Vista previa de la cámara")


label = tk.Label(root)
label.pack()


picam2.start()
root.after(100, update_preview)


root.mainloop()


picam2.stop()