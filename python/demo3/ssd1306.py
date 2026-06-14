from micropython import const
import framebuf
from chinese_font import chinese_font  # 导入中文字库

# 寄存器定义
SET_CONTRAST = const(0x81)
SET_ENTIRE_ON = const(0xA4)
SET_NORM_INV = const(0xA6)
SET_DISP = const(0xAE)
SET_MEM_ADDR = const(0x20)
SET_COL_ADDR = const(0x21)
SET_PAGE_ADDR = const(0x22)
SET_DISP_START_LINE = const(0x40)
SET_SEG_REMAP = const(0xA0)
SET_MUX_RATIO = const(0xA8)
SET_COM_OUT_DIR = const(0xC0)
SET_DISP_OFFSET = const(0xD3)
SET_COM_PIN_CFG = const(0xDA)
SET_DISP_CLK_DIV = const(0xD5)
SET_PRECHARGE = const(0xD9)
SET_VCOM_DESEL = const(0xDB)
SET_CHARGE_PUMP = const(0x8D)

class SSD1306_I2C(framebuf.FrameBuffer):
    def __init__(self, width, height, i2c, addr=0x3C, external_vcc=False):
        self.width = width
        self.height = height
        self.i2c = i2c
        self.addr = addr
        self.external_vcc = external_vcc
        self.pages = self.height // 8
        self.buffer = bytearray(self.pages * self.width)
        super().__init__(self.buffer, self.width, self.height, framebuf.MONO_VLSB)
        self.init_display()

    def init_display(self):
        # 初始化OLED
        for cmd in (
            SET_DISP | 0x00,  # 关闭显示
            SET_MEM_ADDR, 0x00,  # 水平寻址模式
            SET_DISP_START_LINE | 0x00,
            SET_SEG_REMAP | 0x01,  # 段重映射
            SET_MUX_RATIO, self.height - 1,
            SET_COM_OUT_DIR | 0x08,  # COM输出方向
            SET_DISP_OFFSET, 0x00,
            SET_COM_PIN_CFG, 0x02 if self.height == 32 else 0x12,
            SET_DISP_CLK_DIV, 0x80,
            SET_PRECHARGE, 0x22 if self.external_vcc else 0xF1,
            SET_VCOM_DESEL, 0x30,
            SET_CONTRAST, 0xFF,
            SET_ENTIRE_ON,
            SET_NORM_INV,
            SET_CHARGE_PUMP, 0x10 if self.external_vcc else 0x14,
            SET_DISP | 0x01,  # 开启显示
        ):
            self.write_cmd(cmd)
        self.fill(0)
        self.show()

    # 基础控制方法
    def poweroff(self):
        self.write_cmd(SET_DISP | 0x00)

    def poweron(self):
        self.write_cmd(SET_DISP | 0x01)

    def contrast(self, contrast):
        self.write_cmd(SET_CONTRAST)
        self.write_cmd(contrast)

    def invert(self, invert):
        self.write_cmd(SET_NORM_INV | (invert & 1))

    def write_cmd(self, cmd):
        self.i2c.writeto_mem(self.addr, 0x00, bytes([cmd]))

    def write_data(self, data):
        self.i2c.writeto_mem(self.addr, 0x40, data)

    def show(self):
        # 更新显示
        x0, x1 = 0, self.width - 1
        if self.width == 64:
            x0, x1 = 32, 95
        self.write_cmd(SET_COL_ADDR)
        self.write_cmd(x0)
        self.write_cmd(x1)
        self.write_cmd(SET_PAGE_ADDR)
        self.write_cmd(0)
        self.write_cmd(self.pages - 1)
        self.write_data(self.buffer)

    # 中文显示核心方法（适配逐列式+低位在前字模）
    def text_cn(self, text, x, y):
        for char in text:
            if char not in chinese_font:
                self.fill_rect(x, y, 16, 16, 1)  # 占位方块
                x += 16
                continue
                
            font_data = chinese_font[char]
            
            # 逐列处理（16列）
            for col in range(16):
                # 每列2字节：上8行和下8行
                upper_byte = font_data[col * 2]     # 行0-7
                lower_byte = font_data[col * 2 + 1]  # 行8-15
                
                # 处理上8行（低位在前）
                for row in range(8):
                    if upper_byte & (1 << row):  # bit0对应最顶端
                        self.pixel(x + col, y + row, 1)
                
                # 处理下8行（低位在前）
                for row in range(8, 16):
                    bit = row - 8  # 转换为0-7的bit位
                    if lower_byte & (1 << bit):
                        self.pixel(x + col, y + row, 1)
            
            x += 16  # 移动到下一个字符
