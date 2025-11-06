export default class CodePreview {
    constructor(props) {
        this.watch_timer = null
        this.state = false
        this.code = CodeMirror.fromTextArea(document.getElementById('code-preview'), {
            mode: 'python',
            lineNumbers: true,
            readOnly: true
        })

        this.initEvent()
    }
    initEvent() {
        $('#codePreviewButton').on('click', () => {
            this.codePreviewChange(!this.state)
        })
    }
    codePreviewChange(state) {
        $('.code-preview').css('visibility', (state ? 'visible' : 'hidden'))
        if (state) {
            $('.CodeMirror').eq(0).css('height', `calc(100vh - 3.5rem)`)
            this.code.setValue(Code.generateCode())
            this.watchCodeChange()
        } else {
            clearTimeout(this.watch_timer)
            this.code.setValue('')
        }
        this.state = state
    }
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