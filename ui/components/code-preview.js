import Common from './common'

export default class CodePreview extends Common {
    constructor() {
        super()
        this.watch_timer = null // 定时器，监听积木区变动
        this.state = false // 控制预览区是否显示
        this.code = CodeMirror.fromTextArea(document.getElementById('code-preview'), {
            mode: 'python',  // 代码模式
            lineNumbers: true,  // 显示行号
            readOnly: true // 只读模式
        }) // 初始化CodeMirror
    }
    initEvent() {
        $('#codePreviewButton').on('click', () => {
            this.changeCode(!this.state)
        })
    }
    // 显示隐藏预览区
    changeCode(state) {
        let status = state ? 'on' : 'off'
        $('.code-preview').css('visibility', (state ? 'visible' : 'hidden'))
        $('#codePreviewButton').css('background', `url(../media/new-icon/code-${status}.png) center / cover`)
        if (state) {
            $('.CodeMirror').eq(0).css('height', `calc(100vh - 3.5rem)`)
            this.code.setValue(Code.generateCode()) // 通过Code.generateCode()加载代码内容
            this.watchCodeChange() // 开启监听
        } else {
            clearTimeout(this.watch_timer)
            this.code.setValue('')
        }
        this.state = state
    }
    // 监听积木区变动
    watchCodeChange() {
        this.watch_timer = setTimeout(() => {
            let code = Code.generateCode()
            let old_code = this.code.getValue()
            if (code !== old_code) {
                this.code.setValue(code)
            }
            this.watchCodeChange()
        }, 500)
    }
}