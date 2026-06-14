from machine import Pin, I2C
from neopixel import NeoPixel
from ssd1306 import SSD1306_I2C
import time

# LED参数
LED_PIN = 4       # WS2812数据引脚
LED_COUNT = 16    # 灯数量
CONTROL_PIN = 5   # 控制引脚

# 初始化LED和控制引脚
np = NeoPixel(Pin(LED_PIN, Pin.OUT), LED_COUNT)
control_pin = Pin(CONTROL_PIN, Pin.IN, Pin.PULL_DOWN)

# 配置参数
char_spacing = 1    # 字间距
char_size = 16      # 16x16 汉字
scroll_speed = 1    # 滚动熟读（像素/帧）
purple = (128, 0, 128) # 紫色RGB值

class OLED():
  def __init__(self, zh16x16):
    self.zh16x16 = zh16x16
    try:
      self.oled = self.init_hardware()
      self.scroll_offset = 128
      print(self)
      # 初始LED状态设置
      self.control_leds()

      while True:
        # 刷新显示（文字和时间）
        self.scroll_offset = self.display_all()
            
        # 检查LED控制状态（不影响显示刷新频率）
        self.control_leds()
            
        time.sleep(0.05)
    
    except Exception as e:
      if 'oled' in locals():
        self.oled.fill(0) # 清屏
        self.oled.text("Err", 55, 30)
        self.oled.show()
      print("错误", e)
      time.sleep(5)
  
  # 初始化硬件
  def init_hardware(self):
    # API: machine.I2C(id, *, scl, sda, freq=400000)
    # id标识特定的 I2C 外设。允许的值取决于特定的端口/板
    # scl应该是一个 pin 对象，指定用于 SCL 的 pin。
    # sda应该是一个 pin 对象，指定用于 SDA 的 pin。
    # freq应该是一个整数，用于设置 SCL 的最大频率。
    i2c_oled = I2C(0, scl=Pin(1), sda=Pin(0), freq=400000)
    oled = SSD1306_I2C(128, 64, i2c_oled, addr=0x3C)
    
    return oled
  
  # LED控制函数
  def control_leds(self):
    # 读取控制引脚状态
    if control_pin.value() == 1: # 高电平
      # 所有灯珠设为紫色
      for i in range(LED_COUNT):
        np[i] = purple
      np.write() # 刷新显示
    else: # 低电平
      # 所有灯珠熄灭
      for i in range(LED_COUNT):
        np[i] = (0, 0, 0)
      np.write() # 刷新显示

  # 显示内容
  def display(self):
    
    while True:
      # 刷新显示（文字和时间）
      self.scroll_offset = self.display_all()

      # 检查LED控制状态（不影响显示刷新频率）
      self.control_leds()
            
      time.sleep(0.05)

  # 显示函数
  def display_all(self):
    # 清屏
    self.oled.fill(0)

    # 文字
    x = self.scroll_offset
    y = 0
    for idx in range(14):
      if x + char_size > 0 and x < 128:
        self.draw_16x16_char(idx, x, y)
      x += char_size + char_spacing

    # 更新滚动偏移量
    self.scroll_offset -= scroll_speed
    total_width = 14 * (char_size + char_spacing) - char_spacing
    if self.scroll_offset < -total_width:
      self.scroll_offset = 128
    return self.scroll_offset

  # 绘制16x16汉字 （阳码取模适配）
  def draw_16x16_char(self, char_index, x, y):
    if 0 <= char_index < len(self.zh16x16):
      char_data = self.zh16x16[char_index]
      for col in range(16):
        byte1 = char_data[col * 2]
        byte2 = char_data[col * 2 + 1]

        for row in range(8):
          if byte1 & (1 << row):
            self.oled.pixel(x + col, y + row, 1)
        for row in range(8):
          if byte2 & (1 << row):
            self.oled.pixel(x + col, y + 8 + row, 1)

