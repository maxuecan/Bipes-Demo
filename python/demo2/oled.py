from machine import Pin, I2C
from neopixel import NeoPixel
from ssd1306 import SSD1306_I2C

# LED参数
LED_PIN = 4       # WS2812数据引脚
LED_COUNT = 16    # 灯数量
CONTROL_PIN = 5   # 控制引脚

# 初始化LED和控制引脚
np = NeoPixel(Pin(LED_PIN, Pin.OUT), LED_COUNT)
control_pin = Pin(CONTROL_PIN, Pin.IN, Pin.PULL_DOWN)

class OLED():
  def __init__(self):
    self.oled = null
  
  def init_hardware():
    i2c_oled = I2C(0, sda = Pin(0), scl = Pin(1), freq=400000)
    oled = SSD1306_I2C(128, 64, i2c_oled, addr = 0x3C)
