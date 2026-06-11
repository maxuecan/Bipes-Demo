### 类 NeoPixel

```
文档：http://micropython.86x.net/en/latet/library/neopixel.html

该模块为 WS2818 / NeoPixel LED 提供驱动程序。
NeoPixel.write() 在准备好更新条带时调用
例如：
import neopixel

# 32 LED strip connected to X8.
p = machine.Pin.board.X8
n = neopixel.NeoPixel(p, 32)

# Draw a red gradient.
for i in range(32):
    n[i] = (i * 8, 0, 0)

# Update the strip.
n.write()
```

```
classneopixel.NeoPixel(pin, n, *, bpp=3, timing=1)
构造一个 NeoPixel 对象。参数是：

pin是 machine.Pin 实例。
n是灯条中 LED 的数量。
RGB LED 的bpp为 3，RGBW LED 的bpp为 4。
时序为 0 表示 400KHz，而 1 表示 800kHz LED（大多数是 800kHz）。
```