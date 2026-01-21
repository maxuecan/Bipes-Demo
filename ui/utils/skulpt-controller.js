// 使用方式一
import * as Sk from 'skulpt';
// 使用方式二
// import 'skulpt/dist/skulpt.js';
// import 'skulpt/dist/skulpt-stdlib.js';
import Common from '@/components/common'

export default class SkulptController extends Common {
    constructor() {
        super()
        /* skulpt初始化配置 */
        Sk.pre = "output";
        Sk.configure({
            output: this.outF, // 输出函数
            read: this.buildinRead, // 读取函数
            __future__: Sk.python3, // 启用python3特性
        });
        (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'draw-canvas'
        window.Sk.TurtleGraphics.width = 600
        window.Sk.TurtleGraphics.height = 600

        this.sk = Sk
    }
    // 输出内容，将结果输出在终端
    outF(text) {
        // console.log($('.control-preview').css('visibility'))
        term.write(text + '\r')
    }
    buildinRead(file) {
        // console.log("Attempting file: " + Sk.ffi.remapToJs(file));
        if (
            Sk.builtinFiles === undefined ||
            Sk.builtinFiles.files[file] === undefined
        ) {
            throw "File not found: '" + file + "'";
        }

        return Sk.builtinFiles.files[file];
    }
    // 执行python代码
    runPythonCode() {
        let code = Code.generateCode()

        let myPromise = this.sk.misceval.asyncToPromise(() => {
            return this.sk.importMainWithBody("<stdin>", false, code, true);
        });

        myPromise
            .then((res) => {})
            .catch((err) => {})
    }
    // 运行海龟
    runSkulptCode() {
        let code = Code.generateCode()
        let myPromise = this.sk.misceval.asyncToPromise(() => {
            return this.sk.importMainWithBody("<stdin>", false, code, true);
        })

        myPromise
            .then((res) => {})
            .catch((err) => {})
    }
}
