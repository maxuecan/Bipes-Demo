const EventEmitter = require('events')

class EventEmitterController extends EventEmitter {
    constructor() {
        super()

        // 事件监听
        this.on('open-control-preview', () => {
            this.emit('control-preview-change', true)
        })
        this.on('open-draw-preview', () => {
            this.emit('draw-preview-change', true)
        })
        this.on('open-extensions-dialog', () => {
            this.emit('extensions-dialog-change', true)
        })
        this.on('on-reset-mode', (mode) => {
            this.emit('reset-mode', mode)
        })
    }
}

export default new EventEmitterController()
