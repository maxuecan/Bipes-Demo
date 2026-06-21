from machine import Pin, I2C
from ssd1306 import SSD1306_I2C
from font import fonts
import time

# 0.96寸 OLED 128x64 I2C驱动 

# I2C配置
prot = 0
scl = 1
sda = 0
freq = 400000

# OLED配置
width = 128
height = 64

# 配置参数
char_size = 16
scroll_speed = 1

class OLED:
  def __init__(self):
    self.i2c = self.init_i2c(prot, scl, sda, freq)
    self.oled = self.init_oled()
    self.is_scroll = True
    self.scroll_offset = 128

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
  
  def text(self, string, x, y, font_size=8):
    # 显示字符串，英文、数字
    if font_size != 8 and font_size != 16 and font_size != 24 and font_size != 32:
      return

    if font_size == 8:
      self.oled.text(string, x, y)
      return
    
  def text_cn(self, string, x, y, font_size=16):
    count = 0
    for str in string:
      if str in fonts:
        x = count * font_size
        count += 1
        char_data = fonts[str]
        for col in range(16):
          byte1 = char_data[col * 2]
          byte2 = char_data[col * 2 + 1]

          for row in range(8):
            if byte1 & (1 << row):
              self.oled.pixel(x + col, y + row, 1)
          for row in range(8):
            if byte2 & (1 << row):
              self.oled.pixel(x + col, y + 8 + row, 1)

  def draw_text(self, string, scroll_offset, y):
    self.oled.fill(0)
    x = scroll_offset
    y = 16
    for str in string:
      if x + char_size > 0 and x < 128:
        if str in fonts:
          char_data = fonts[str]
          for col in range(16):
            byte1 = char_data[col * 2]
            byte2 = char_data[col * 2 + 1]

            for row in range(8):
              if byte1 & (1 << row):
                self.oled.pixel(x + col, y + row, 1)
            for row in range(8):
              if byte2 & (1 << row):
                self.oled.pixel(x + col, y + 8 + row, 1)
      x += char_size + 1

    self.oled.show()

    # 更新滚动偏移量
    scroll_offset -= scroll_speed
    total_width = 14 * (char_size + 1) - 1
    if (scroll_offset < -total_width):
      scroll_offset = 128
    return scroll_offset

  def text_scroll(self, string, y):
    try:
      while self.is_scroll:
        self.scroll_offset = self.draw_text(string, self.scroll_offset, y)
        time.sleep(0.05)

    except Exception as e:
      # self.oled.fill(0)
      # self.oled("Err", 55, 30)
      # self.oled.show()
      # self.is_scroll = False
      print('错误：', e)

  
  def stop_scroll(self):
    self.is_scroll = False
