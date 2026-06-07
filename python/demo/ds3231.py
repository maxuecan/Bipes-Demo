from machine import I2C
import time

class DS3231:
    """DS3231实时时钟模块驱动类"""
    
    def __init__(self, i2c: I2C, addr: int = 0x68) -> None:
        """
        初始化DS3231模块
        :param i2c: I2C总线对象
        :param addr: I2C设备地址，默认0x68
        """
        self.i2c = i2c
        self.addr = addr
        self._check_device()
        
    def _check_device(self) -> None:
        """检查设备是否连接"""
        if self.addr not in self.i2c.scan():
            raise OSError(f"DS3231设备未找到，地址0x{self.addr:02X}不在I2C总线上")
    
    @staticmethod
    def _bcd2dec(bcd: int) -> int:
        """
        BCD码转十进制
        :param bcd: BCD码值
        :return: 十进制数值
        """
        return (bcd >> 4) * 10 + (bcd & 0x0F)
    
    @staticmethod
    def _dec2bcd(dec: int) -> int:
        """
        十进制转BCD码
        :param dec: 十进制数值
        :return: BCD码值
        """
        return (dec // 10) << 4 | (dec % 10)
    
    def get_time(self) -> tuple:
        """
        获取当前时间
        :return: 时间元组 (年, 月, 日, 时, 分, 秒, 星期)
        """
        # 从0x00寄存器开始读取7字节数据
        data = self.i2c.readfrom_mem(self.addr, 0x00, 7)
        
        # 解析数据（去除无效位）
        seconds = self._bcd2dec(data[0] & 0x7F)  # 清除OSF位
        minutes = self._bcd2dec(data[1])
        hours = self._bcd2dec(data[2] & 0x3F)     # 清除12/24小时制位
        weekday = self._bcd2dec(data[3])
        day = self._bcd2dec(data[4])
        month = self._bcd2dec(data[5] & 0x1F)     # 清除世纪位
        year = 2000 + self._bcd2dec(data[6])      # 年份从2000年开始
        
        return (year, month, day, hours, minutes, seconds, weekday)
    
    def set_time(self, year: int, month: int, day: int, 
                 hour: int, minute: int, second: int, weekday: int = 1) -> None:
        """
        设置时间
        :param year: 年份 (2000-2100)
        :param month: 月份 (1-12)
        :param day: 日期 (1-31)
        :param hour: 小时 (0-23)
        :param minute: 分钟 (0-59)
        :param second: 秒钟 (0-59)
        :param weekday: 星期 (1-7, 1=周一)
        """
        # 参数范围校验
        if not (2000 <= year <= 2100):
            raise ValueError("年份必须在2000-2100之间")
        if not (1 <= month <= 12):
            raise ValueError("月份必须在1-12之间")
        if not (1 <= day <= 31):
            raise ValueError("日期必须在1-31之间")
        if not (0 <= hour <= 23):
            raise ValueError("小时必须在0-23之间")
        if not (0 <= minute <= 59):
            raise ValueError("分钟必须在0-59之间")
        if not (0 <= second <= 59):
            raise ValueError("秒钟必须在0-59之间")
        if not (1 <= weekday <= 7):
            raise ValueError("星期必须在1-7之间")
        
        # 转换为BCD码并准备数据
        data = bytearray([
            self._dec2bcd(second),
            self._dec2bcd(minute),
            self._dec2bcd(hour),
            self._dec2bcd(weekday),
            self._dec2bcd(day),
            self._dec2bcd(month),
            self._dec2bcd(year - 2000)  # 存储相对于2000年的偏移
        ])
        
        # 写入数据到0x00寄存器
        self.i2c.writeto_mem(self.addr, 0x00, data)
        
        # 等待写入完成
        time.sleep_ms(10)
    
    def get_temperature(self) -> float:
        """
        获取模块内部温度
        :return: 温度值（摄氏度）
        """
        # 读取温度寄存器（0x11和0x12）
        data = self.i2c.readfrom_mem(self.addr, 0x11, 2)
        
        # 解析10位温度数据
        temp_raw = (data[0] << 8 | data[1]) >> 6
        return temp_raw / 4.0  # 转换为摄氏度
    
    def is_oscillator_running(self) -> bool:
        """
        检查振荡器是否运行（判断时间是否有效）
        :return: 振荡器运行状态，True为正常运行
        """
        status = self.i2c.readfrom_mem(self.addr, 0x0F, 1)[0]
        return not (status & 0x80)  # OSF位为0表示振荡器正常运行
    