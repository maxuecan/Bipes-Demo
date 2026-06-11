from micropython import const
import framebuf

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

class SSD1306:
    def __init__(self, width, height, external_vcc):
        self.width = width
        self.height = height
        self.external_vcc = external_vcc
        self.pages = self.height // 8
        # 请注意，子类必须将self.framebuf初始化为帧缓冲区
        # 这是必要的，因为底层数据缓冲区不同
        # 在I2C和SPI实现之间（I2C需要额外的字节）
        # self.poweron()
        self.init_display()

    def init_display(self):
        # 初始化OLED
        for cmd in (
            SET_DISP | 0x00, # 关闭显示
            # 地址设置
            SET_MEM_ADDR, 0x00, # 水平寻址模式
            # 分辨率和布局
            SET_DISP_START_LINE | 0x00,
            SET_SEG_REMAP | 0x01, # 段重映射 (列addr127 映射到 SEG0)
            SET_MUX_RATIO, self.height - 1,
            SET_COM_OUT_DIR | 0x08,  # COM输出方向 (从COM[N]扫描到COM0)
            SET_DISP_OFFSET, 0x00,
            SET_COM_PIN_CFG, 0x02 if self.height == 32 else 0x12,
            # 时间 和 行使 方案
            SET_DISP_CLK_DIV, 0x80,
            SET_PRECHARGE, 0x22 if self.external_vcc else 0xf1,
            SET_VCOM_DESEL, 0x30, # 0.83*Vcc
            # 显示
            SET_CONTRAST, 0xFF, # 最大限度
            SET_ENTIRE_ON, # 输出遵循RAM内容
            SET_NORM_INV, # 不进行反向
            # 电荷泵
            SET_CHARGE_PUMP, 0x10 if self.external_vcc else 0x14,
            SET_DISP | 0x01
        ): # 开始
            self.write_cmd(cmd)
        self.fill(0)
        self.show()

    # 用指定的颜色填充整个 FrameBuffer
    def fill(self, col):


class SSD1306_I2C(SSD1306):
    def __init__(self, width, height, i2c, addr=0x3c, external_vcc=False):
        self.width = width
        self.height = height
        self.i2c = i2c
        self.addr = addr
        self.temp = bytearray(2)
        self.external_vcc = external_vcc
        # self.pages = self.height // 8
        self.buffer = bytearray(((height // 8) * width) + 1)
        # self.buffer = bytearray(self.pages * self.width)
        self.framebuf = framebuf.FrameBuffer(self.buffer, self.width, self.height, framebuf.MONO_VLSB)
        super().__init__(width, height, external_vcc)

    def write_cmd(self, cmd):
        # I2C.writeto_mem(addr, memaddr, buf, *, addrsize=8)
        # 从memaddr指定的内存地址开始，将buf写入addr指定的从站。参数addrsize以位为单位指定地址大小
        self.i2c.writeto_mem(self.addr, 0x00, bytes([cmd]))
        # I2C.writeto(addr, buf, stop=True, /)
        # 将buf 中的字节写入addr指定的从站。如果在从buf写入一个字节后收到 NACK，则不会发送剩余的字节。如果stop为真，则在传输结束时生成 STOP 条件，即使收到 NACK 也是如此。该函数返回接收到的 ACK 数
        self.i2c.writeto(self.addr, self.temp)
