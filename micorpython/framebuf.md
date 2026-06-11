# 类 framebuf  帧缓冲区操作

```
http://micropython.circuitpython.com.cn/en/latet/library/framebuf.html

该模块提供了一个通用帧缓冲区，可用于创建位图图像，然后可以将其发送到显示器

FrameBuffer 类提供了一个像素缓冲区，可以使用像素、线条、矩形、文本甚至其他 FrameBuffer 来绘制它。它在为显示器生成输出时很有用。
```

```
classframebuf.FrameBuffer(buffer, width, height, format, stride=width, /)
构造一个 FrameBuffer 对象。参数是：

buffer是一个具有缓冲协议的对象，该协议必须足够大以包含由 FrameBuffer 的宽度、高度和格式定义的每个像素。

width是 FrameBuffer 的宽度（以像素为单位）

height是 FrameBuffer 的高度（以像素为单位）

format指定了 FrameBuffer 中使用的像素类型；允许的值列在下面的常量下。这些设置用于编码颜色值的位数以及这些位在缓冲区中的布局。在将颜色值 c 传递给方法的情况下，c 是一个小整数，其编码取决于 FrameBuffer 的格式。

stride是 FrameBuffer 中每条水平像素线之间的像素数。这默认为宽度，但在另一个更大的 FrameBuffer 或屏幕中实现 FrameBuffer 时可能需要调整。所述缓冲器的大小必须容纳增加的步长大小。

必须指定有效的缓冲区、宽度、高度、格式和可选的stride。无效的缓冲区大小或维度可能会导致意外错误。
```

