from oled import OLED

oled = OLED()
# 显示英文数字
# oled.oled.fill(0)
# oled.text("a", 0, 0, 8)
# oled.oled.show()

# 显示中文
# oled.oled.fill(0)
# oled.text_cn("比老马还六", 0, 0, 16)
# oled.oled.show()

# 显示滚动文字
oled.oled.fill(0)
oled.text_cn('比老马还六', 0, 0)
oled.oled.show()
oled.text_scroll()
