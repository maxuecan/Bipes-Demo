# 目录结构（开发目录ui下）
ui
├── b               // blockly语言包
├── msg             // 语言包
├── blockly         // blocks积木块库
├── core            // 原项目文件
├── css             // 样式文件目录
├── devinfo         // 硬件设备配置信息
├── examples        // 案例
├── media           // 媒体资源
├── plugins         // 插件资源
├── pylibs          // python案例文件
├── toolbox         // 积木默认工具箱/默认积木
├── utils           // 工具类
├── index.html      // 入口文件
├── index.js        // 打包入口文件
├── build           // 打包输出目录
├── build.js        // 生产环境打包脚本
├── webpack.config-dev.js   // 开发环境webpack配置
├── webpack.config.js       // 生产环境webpack配置

# node版本
20以上

# webpack插件下载报错处理
1，npm ERR! gifsicle@5.3.0 postinstall: `node lib/install.js`
npm i imagemin-gifsicle@7.0.0 -D --ignore-scripts
npm i imagemin-jpegtran@7.0.0 -D --ignore-scripts
npm i imagemin-optipng@8.0.0 -D --ignore-scripts
npm i imagemin-svgo@10.0.1 -D --ignore-scripts

2，node_modules\optipng-bin\vendor\optipng.exe ENOENT 缺少.exe文件
项目根目录有optipng文件夹，将.exe文件复制到node_modules\optipng-bin\vernder

# 项目运行
1，开发环境
cd ui
npm install
npm run dev

2，生产环境
cd ui
npm install
node build
