const fs = require('fs')
const path = require('path');
const modules = path.join(__dirname);
const exec = require('child_process').exec;
const stat = fs.stat;

// 默认node_modules地址
global.buildPath = path.join(__dirname, 'build');

// 开始执行
initialization()

// 包装函数，同步触发
async function initialization() {
  // 判断路径是否存在
  let startUrl = modules
  if (fs.existsSync(startUrl)) {
    await startCommand()
  }
}

// 开始执行第三步：调用命令
function startCommand() {
  return new Promise(resolve => {
    console.log('调用命令');
    console.log('-----------');
    // 进入工程目录/执行命令
    processExecution()
    resolve()
  })
}

// 执行进程
function processExecution() {
  console.log('进入执行命令');
  console.log('-----------');
  // 执行命令操作
  exec('npm run build', (err, stdout, stderr) => {
    (async () => {
      console.log('命令执行完毕');
      console.log('-----------');
      await throwBack()
      console.log(`打包信息 ${stdout}`)
      if (err) {
        console.error(`exec error: ${err}`);
        throw new Error(`exec error: ${err}`)
        // return;
      }
      // if(stderr) {
      //   console.error(`std error: ${stderr}`)
      // }
    })()
  });
}

// 在复制目录前需要判断该目录是否存在
function exists(src, dst, callback) {
  fs.exists(dst, function (exists) {
    // 已存在
    if (exists) {
      callback(src, dst);
    }
    // 不存在创建文件
    else {
      fs.mkdir(dst, function () {
        callback(src, dst);
      });
    }
  });
};

// 命令执行完毕抛回
function throwBack() {
  return new Promise(async (resolve, reject) => {
    console.log('目录抛回');
    // 复制目录
    // await exists('./devinfo', './build/devinfo', copyDir)
    // await exists('./jsTree', './build/jsTree', copyDir)
    await exists('./media', './build/media', copyDir)
    console.log('-----------');
    console.log('抛回执行中');
    setTimeout(() => {
      resolve()
    }, 3000);
    console.log('-----------');
    console.log('抛回完毕');
    console.log('测试');
  })
}

function copyDir(srcDir, destDir) {
  // // 读取源目录下的所有文件和子目录
  // let entries = fs.readdirSync(src)
  // let stat
  // let srcPath
  // let dstPath

  // for (let i = 0; i < entries.length; i++) {
  //   srcPath = path.join(src, entries[i])
  //   dstPath = path.join(dst, entries[i])

  //   stat = fs.statSync(srcPath)
  //   if (stat.isDirectory()) {
  //     // 如果是子目录，递归调用copyDir函数进行拷贝
  //     fs.mkdirSync(dstPath, {recursive: true})
  //   } else {
  //     // 如果是文件，使用fs.copyFile进行拷贝
  //     fs.copyFileSync(srcPath, dstPath)
  //   }
  // }

  // 读取源文件夹中的文件和子文件夹  
  fs.readdir(srcDir, { withFileTypes: true }, (err, files) => {  
    if (err) {  
      console.error('无法读取源文件夹:', err);  
      return;  
    }  
  
    files.forEach(file => {  
      // 获取源文件或文件夹的绝对路径  
      const srcPath = path.resolve(srcDir, file.name);  
  
      // 获取目标文件或文件夹的绝对路径  
      const destPath = path.resolve(destDir, file.name);  
  
      // 如果是文件，直接复制文件  
      if (!file.isDirectory()) {  
        fs.copyFileSync(srcPath, destPath);  
      } else {  
        // 如果是文件夹，递归复制文件夹内容  
        fs.mkdir(destPath, { recursive: true }, (err) => {  
          if (err) {  
            console.error('无法创建目标文件夹:', err);  
            return;  
          }  
          copyDir(srcPath, destPath);  
        });  
      }  
    });  
  });  
}
