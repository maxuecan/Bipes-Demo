// import Init from '../components/init.js'
import CodePreview from '../components/code-preview.js'
import ControlPreview from '../components/control-preview.js'

import SkulptController from './skulpt-controller.js'
// import EventEmitterController from './event-emitter-controller.js'

export default class BipesController {
    constructor(container) {
        this.SKULPT_CONSTROLER = new SkulptController()

        // this.INIT = new Init()
        this.CODE_PREVIEW = new CodePreview()
        this.CONTROL_PREVIEW = new ControlPreview(document.getElementsByClassName('control-preview')[0])

    }
}
