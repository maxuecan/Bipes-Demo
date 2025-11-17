// 使用方式一
import * as Sk from 'skulpt';
// 使用方式二
// import 'skulpt/dist/skulpt.js';
// import 'skulpt/dist/skulpt-stdlib.js';
import Common from '../components/common'
import EventEmitterController from './event-emitter-controller'

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

        this.sk = Sk
    }
    initEvent() {
        // 运行按钮
        $('#sk-run').on('click', () => {
            this.runPythonCode()
            EventEmitterController.emit('open-control-pewivew')
        })
    }
    // 输出内容，将结果输出在终端
    outF(text) {
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
}
