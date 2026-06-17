from machine import Pin, I2C
from ssd1306 import SSD1306_I2C

# 0.96寸 OLED 128x64 I2C驱动 

# I2C配置
prot = 0
scl = 1
sda = 0
freq = 400000

# OLED配置
width = 128
height = 64

class OLED:
  def __init__(self):
    self.i2c = self.init_i2c(prot, scl, sda, freq)
    self.oled = self.init_oled()

  def init_i2c(self, id, scl, sda, freq=400000):
    # 初始化i2c接口
    # I2C(id, *, scl, sda, freq=400000) 是一种用于设备间通信的两线协议
    # id: 标识特定的 I2C 外设。允许的值取决于特定的端口/板
    # scl: 时钟线，是一个 pin 对象，指定用于 SCL 的 pin
    # sda: 数据线，是一个 pin 对象，指定用于 SDA 的 pin
    # freq：是一个整数，是 SCL 时钟频率
    _i2c = I2C(id, scl=Pin(scl), sda=Pin(sda), freq=freq)
    return _i2c
  
  def init_oled(self):
    # 初始oled
    _oled = SSD1306_I2C(width, height, self.i2c)
    return _oled
