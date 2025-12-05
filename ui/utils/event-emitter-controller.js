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
    }
}

export default new EventEmitterController()
