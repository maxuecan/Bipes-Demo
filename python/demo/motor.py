import smbus
import time
import traitlets
import os

class Motor(traitlets.HasTraits):
	def __init__(self,d1,d2,d3,d4):
		# 设置PCA9685 I2C地址
		self.PCA9685_ADDRESS = 0x60

		# 寄存器地址
		self.MODE1 = 0x00
		self.PRE_SCALE = 0xFE
		self.LED0_ON_L = 0x06

		# 初始化I2C总线
		self.bus = smbus.SMBus(2)
		self.set_pwm_frequency(50)
		self.set_pwm(d1,d2,d3,d4)
		self.Stop()

		exists = os.path.isfile('Calibrated_value.txt')
		if (exists):
			with open('Calibrated_value.txt', 'r') as file:
				line = file.readline().strip()  # 读取第一行并去除末尾的换行符
				params = line.split()  # 用空格分割参数
				if len(params) >= 2:
					self.release_angle1=int(params[0])
					self.release_angle2=int(params[1])
				else:
					self.release_angle1=90
					self.release_angle2=90
		else:
			self.release_angle1=90
			self.release_angle2=90

		self.servo_release()


	def overload(func):
		registry = {}

		def register(num_args):
			def decorator(f):
				registry[num_args] = f
				return f
			return decorator

		def wrapper(self, *args):
			num_args = len(args)
			f = registry.get(num_args)
			if f is None:
				raise TypeError(f"No overload of function '{func.__name__}' takes {num_args} arguments")
			return f(self, *args)

		wrapper.register = register
		return wrapper
	
	# 前进
	@overload
	def Advance(self):
		print("No arguments")

	@Advance.register(0)
	def _Advance(self):
		self.Status_control(1,1,1,1)
	
	@Advance.register(1)
	def _Advance(self, speed):
		print("1 argument: speed")
		self.GS_run(speed, speed)
		self.Status_control(1, 1, 1, 1)

	@Advance.register(2)
	def _Advance(self, speed, times):
		print("2 arguments: speed, times")
		self.GS_run(speed, speed)
		self.Status_control(1, 1, 1, 1)
		time.sleep(times)
		self.Status_control(0, 0, 0, 0)

	#后退
	@overload
	def Back(self):
		print("No arguments")
	
	@Back.register(0)
	def	_Back(self):
		self.Status_control(-1,-1,-1,-1)

	@Back.register(1)
	def	_Back(self,speed):
		self.GS_run(speed, speed)
		self.Status_control(-1,-1,-1,-1)

	@Back.register(2)
	def	_Back(self,speed,times):
		self.GS_run(speed, speed)
		self.Status_control(-1,-1,-1,-1)
		time.sleep(times)
		self.Status_control(0, 0, 0, 0)

	#平移向左
	@overload
	def Move_Left(self):
		print("No arguments")

	@Move_Left.register(0)
	def _Move_Left(self):
		self.Status_control(-1,1,1,-1)

	@Move_Left.register(1)
	def _Move_Left(self,speed):
		self.GS_run(speed, speed)
		self.Status_control(-1,1,1,-1)

	@Move_Left.register(2)
	def _Move_Left(self,speed,times):
		self.GS_run(speed, speed)
		self.Status_control(-1,1,1,-1)
		time.sleep(times)
		self.Status_control(0, 0, 0, 0)
	
	#平移向右
	@overload
	def Move_Right(self):
		print("No arguments")

	@Move_Right.register(0)
	def _Move_Right(self):
		self.Status_control(1,-1,-1,1)

	@Move_Right.register(1)
	def _Move_Right(self,speed):
		self.GS_run(speed, speed)
		self.Status_control(1,-1,-1,1)

	@Move_Right.register(2)
	def _Move_Right(self,speed,times):
		self.GS_run(speed, speed)
		self.Status_control(1,-1,-1,1)
		time.sleep(times)
		self.Status_control(0, 0, 0, 0)

	#右旋转
	@overload
	def Rotate_Right(self):
		print("No arguments")

	@Rotate_Right.register(0)
	def _Rotate_Right(self):
		self.Status_control(1,-1,1,-1)

	@Rotate_Right.register(1)
	def _Rotate_Right(self,speed):
		self.GS_run(speed, speed)
		self.Status_control(1,-1,1,-1)

	@Rotate_Right.register(2)
	def _Rotate_Right(self,speed,times):
		self.GS_run(speed, speed)
		self.Status_control(1,-1,1,-1)
		time.sleep(times)
		self.Status_control(0, 0, 0, 0)

	#左旋转
	@overload
	def Rotate_Left(self):
		print("No arguments")

	@Rotate_Left.register(0)
	def _Rotate_Left(self):
		self.Status_control(-1,1,-1,1)

	@Rotate_Left.register(1)
	def _Rotate_Left(self,speed):
		self.GS_run(speed, speed)
		self.Status_control(-1,1,-1,1)

	@Rotate_Left.register(2)
	def _Rotate_Left(self,speed,times):
		self.GS_run(speed, speed)
		self.Status_control(-1,1,-1,1)
		time.sleep(times)
		self.Status_control(0, 0, 0, 0)

	#左前
	@overload
	def Advance_Left(self):
		print("No arguments")

	@Advance_Left.register(0)
	def _Advance_Left(self):
		self.Status_control(0,1,1,0)

	@Advance_Left.register(1)
	def _Advance_Left(self,speed):
		self.GS_run(speed, speed)
		self.Status_control(0,1,1,0)

	@Advance_Left.register(2)
	def _Advance_Left(self,speed,times):
		self.GS_run(speed, speed)
		self.Status_control(0,1,1,0)
		time.sleep(times)
		self.Status_control(0, 0, 0, 0)

	#右前
	@overload
	def Advance_Right(self):
		print("No arguments")

	@Advance_Right.register(0)
	def _Advance_Right(self):
		self.Status_control(1,0,0,1)

	@Advance_Right.register(1)
	def _Advance_Right(self,speed):
		self.GS_run(speed, speed)
		self.Status_control(1,0,0,1)

	@Advance_Right.register(2)
	def _Advance_Right(self,speed,times):
		self.GS_run(speed, speed)
		self.Status_control(1,0,0,1)
		time.sleep(times)
		self.Status_control(0, 0, 0, 0)

	#左后
	@overload
	def Back_Left(self):
		print("No arguments")

	@Back_Left.register(0)
	def _Back_Left(self):
		self.Status_control(-1,0,0,-1)

	@Back_Left.register(1)
	def _Back_Left(self,speed):
		self.GS_run(speed, speed)
		self.Status_control(-1,0,0,-1)

	@Back_Left.register(2)
	def _Back_Left(self,speed,times):
		self.GS_run(speed, speed)
		self.Status_control(-1,0,0,-1)
		time.sleep(times)
		self.Status_control(0, 0, 0, 0)

	#右后
	@overload
	def Back_Right(self):
		print("No arguments")

	@Back_Right.register(0)
	def _Back_Right(self):
		self.Status_control(0,-1,-1,0)

	@Back_Right.register(1)
	def _Back_Right(self,speed):
		self.GS_run(speed, speed)
		self.Status_control(0,-1,-1,0)

	@Back_Right.register(2)
	def _Back_Right(self,speed,times):
		self.GS_run(speed, speed)
		self.Status_control(0,-1,-1,0)
		time.sleep(times)
		self.Status_control(0, 0, 0, 0)

	#动力
	@overload
	def GS_run(self):
		print("No arguments")
	
	@GS_run.register(2)
	def _GS_run(self,L_speed,R_speed):
		if all(0 <= speed <=4095 for speed in [L_speed,R_speed]):
			self.set_pwm(L_speed,R_speed,L_speed,R_speed)
		else:
			print("Input Error,please input value betweent 0~4095")

	@GS_run.register(4)
	def _GS_run(self,L_U_speed,R_U_speed,L_D_speed,R_D_speed):
		if all(0 <= speed <= 4095 for speed in [L_U_speed, R_U_speed, L_D_speed, R_D_speed]):
			self.set_pwm(L_U_speed,R_U_speed,L_D_speed,R_D_speed)
		else:
			print("Input Error,please input value betweent 0~4095")


	def Stop(self):#停止
		self.Status_control(0,0,0,0)

	def _Turn(self,L,R):#右掉头 L 左车轮动力 右车轮动力
		self.Status_control(1,-1,1,-1)
		self.set_pwm(L,R,L,R)


	#设置PWM信号
	def set_pwm_frequency(self,freq):
		# 计算预分频值
		prescale_val = int(25000000.0 / (4096 * freq) - 1)

		# 读取当前MODE1寄存器的值
		old_mode = self.bus.read_byte_data(self.PCA9685_ADDRESS, self.MODE1)

		# 设置SLEEP位（MODE1寄存器的第4位）为1，进入睡眠模式
		new_mode = (old_mode & 0x7F) | 0x10
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.MODE1, new_mode)

		# 设置预分频寄存器的值
		self.bus.write_byte_data(self.PCA9685_ADDRESS,self.PRE_SCALE,prescale_val)

		# 将SLEEP位设置为0，退出睡眠模式
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.MODE1, old_mode)

		# 等待至少500us，以确保OSC稳定
		time.sleep(0.005)

		# 将RESTART位（MODE1寄存器的第7位）设置为1，重启设备
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.MODE1, old_mode | 0x80)

		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.MODE1, 0x00)


	def set_pwm(self,Duty_channel4,Duty_channel3,Duty_channel2,Duty_channel1):
		# 设置PWM通道的占空比
		Duty_channel1 = max(0, min(Duty_channel1, 4095))  # 限制off_time在0-4095之间
		Duty_channel2 = max(0, min(Duty_channel2, 4095))  # 限制off_time在0-4095之间
		Duty_channel3 = max(0, min(Duty_channel3, 4095))  # 限制off_time在0-4095之间
		Duty_channel4 = max(0, min(Duty_channel4, 4095))  # 限制off_time在0-4095之间


		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 0, 0 & 0xFF)
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 0 + 1, 0 >> 8)
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 0 + 2, Duty_channel1 & 0xFF)
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 0 + 3, Duty_channel1 >> 8)

		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 5, 0 & 0xFF)
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 5 + 1, 0 >> 8)
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 5 + 2, Duty_channel2 & 0xFF)
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 5 + 3, Duty_channel2 >> 8)

		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 6, 0 & 0xFF)
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 6 + 1, 0 >> 8)
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 6 + 2, Duty_channel3 & 0xFF)
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 6 + 3, Duty_channel3 >> 8)

		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 11, 0 & 0xFF)
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 11 + 1, 0 >> 8)
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 11 + 2, Duty_channel4 & 0xFF)
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 11 + 3, Duty_channel4 >> 8)


	#设置控制电机正反转
	def Status_control(self,m4,m3,m2,m1):

		if m1==-1:
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 1, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 1 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 1 + 2, 4095 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 1 + 3, 4095 >> 8)

			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 2 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 2 + 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 2 + 3, 0 >> 8)

		elif m1==0:
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 1, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 1 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 1 + 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 1 + 3, 0 >> 8)

			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 2 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 2 + 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 2 + 3, 0 >> 8)

		elif m1==1:
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 1, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 1 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 1 + 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 1 + 3, 0 >> 8)

			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 2 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 2 + 2, 4095 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 2 + 3, 4095 >> 8)


		if m2==-1:
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 3, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 3 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 3 + 2, 4095 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 3 + 3, 4095 >> 8)

			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 4, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 4 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 4 + 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 4 + 3, 0 >> 8)
		elif m2==0:
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 3, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 3 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 3 + 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 3 + 3, 0 >> 8)

			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 4, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 4 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 4 + 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 4 + 3, 0 >> 8)

		elif m2==1:
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 3, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 3 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 3 + 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 3 + 3, 0 >> 8)

			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 4, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 4 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 4 + 2, 4095 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 4 + 3, 4095 >> 8)


		if m3==-1:
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 7, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 7 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 7 + 2, 4095 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 7 + 3, 4095 >> 8)

			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 8, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 8 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 8 + 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 8 + 3, 0 >> 8)
		elif m3==0:
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 7, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 7 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 7 + 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 7 + 3, 0 >> 8)


			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 8, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 8 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 8 + 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 8 + 3, 0 >> 8)

		elif m3==1:
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 7, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 7 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 7 + 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 7 + 3, 0 >> 8)

			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 8, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 8 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 8 + 2, 4095 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 8 + 3, 4095 >> 8)


		if m4==-1:
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 9, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 9 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 9 + 2, 4095 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 9 + 3, 4095 >> 8)

			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 10, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 10 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 10 + 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 10 + 3, 0 >> 8)

		elif m4==0:
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 9, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 9 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 9 + 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 9 + 3, 0 >> 8)


			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 10, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 10 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 10 + 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 10 + 3, 0 >> 8)

		elif m4==1:
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 9, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 9 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 9 + 2, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 9 + 3, 0 >> 8)

			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 10, 0 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 10 + 1, 0 >> 8)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 10 + 2, 4095 & 0xFF)
			self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * 10 + 3, 4095 >> 8)


	#设置云台控制
	def servo_get_Duty(self,angle):
		min_pulse = 500
		max_pulse = 2500
		angle = max(0, min(180, angle))  # 限制角度在0到180度之间
		pulse_width = int ((angle / 180.0) *(max_pulse - min_pulse) + min_pulse)
		duty_cycle = (pulse_width/20000)*4096   # 将脉冲宽度转换为占空比
		return int(duty_cycle)


	def set_servo(self,channel,angle1):
		# 设置PWM通道的占空比
		Duty_channel1 =self.servo_get_Duty(angle1)

		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * channel, 0 & 0xFF)
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * channel + 1, 0 >> 8)
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * channel + 2, Duty_channel1 & 0xFF)
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.LED0_ON_L + 4 * channel + 3, Duty_channel1 >> 8)

	def servo_release(self):
		self.set_servo(12,self.release_angle1)
		self.set_servo(13,self.release_angle2)

	def servo_ptz(self, vt, ac):
		'''初始化云台 俯仰角, 水平角'''

		self.set_servo(12, self.release_angle1 - vt)
		self.set_servo(13, self.release_angle2 - ac)


	def close(self):
		self.Stop()
		time.sleep(0.1)
		self.bus.write_byte_data(self.PCA9685_ADDRESS, self.MODE1, 0x00)


#实例化类
Control_Motor=Motor(0,0,0,0)

if __name__ == "__main__":
	try:
		print("start")
		Control_Motor.GS_run(2000,2000) #左侧车轮动力	右侧车轮动力
		Control_Motor.GS_run(3000,3000,3000,3000) #左前车轮动力	右前车轮动力 左后车轮动力	右后车轮动力
		while True:		

			Control_Motor.Rotate_Left()	#向右平移
			time.sleep(1)
			Control_Motor.Stop()

			time.sleep(5)

			Control_Motor.Rotate_Left(3000) #向右平移	动力 整形 （0 ~ 4095）
			time.sleep(1)
			Control_Motor.Stop()

			time.sleep(5)

			Control_Motor.Rotate_Left(4000,2) #向右平移		动力 整形 （0 ~ 4095）		时间 浮点 

			break

	except KeyboardInterrupt:
		# 使用Ctrl+C退出循环时，关闭PCA9685
		Control_Motor.bus.write_byte_data(Control_Motor.PCA9685_ADDRESS, Control_Motor.MODE1, 0x00)

	Control_Motor.close()

