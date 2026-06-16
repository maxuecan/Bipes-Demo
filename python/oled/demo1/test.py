import sys
_file = open('./ascii16.txt', 'r')

_file.seek(ord("a") * 86)
get_line = _file.readline()

data = []
n = 0
for v in get_line.split(','):
    data.append(int(v, 16))
    n += 1
    if n == 16:
        break
print(data)
