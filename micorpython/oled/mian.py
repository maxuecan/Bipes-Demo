from oled import OLED

oled = OLED()
# 显示英文数字
# oled.clear()
# oled.text("a", 0, 0, 8)
# oled.show()

# 显示中文
# oled.clear()
# oled.text_cn("比老马还六", 0, 0, 16)
# oled.show()

# 显示滚动文字
oled.clear()
oled.text_cn('比老马还六', 0, 0)
oled.show()
oled.text_scroll()
