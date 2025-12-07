import EventEmitterController from '../utils/event-emitter-controller'
import DragController from '../utils/drag-controller'

export default class ControlPreview {
    constructor() {
        this.element = new DragController(
            document.getElementsByClassName('control-preview')[0],
            {
                minWidth: 560,
                minHeight: 400,
                maxWidth: 800,
                maxHeight: 607
            },
            'control',
            () => {
                term.resize()
            }
        )

        this.state = false // 控制台状态
        this.initEvent() // 初始化事件

        EventEmitterController.on('control-preview-change', (state) => {
            this.changeConsole(state)
        })
    }
    initEvent() {
        $('#consolePreviewButton').on('click', () => {
            this.changeConsole(!this.state)
        })
        // 终端清空功能
        $('.control-clear').on('click', () => {
            term.write('\x1bc')
        })
        $('.control-close').on('click', () => {
            this.changeConsole(false)
        })
    }
    // 显示隐藏预览区
    changeConsole(state) {
        let status = state ? 'on' : 'off'
        $('.control-preview').css('visibility', (state ? 'visible' : 'hidden'))
        $('#consolePreviewButton').css('background', `url(../media/new-icon/console-${status}.png) center / cover`)
        this.state = state
    }
}
