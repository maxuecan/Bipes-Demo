// import Init from '../components/init.js'
import CodePreview from '../components/code-preview.js'
import ControlPreview from '../components/control-preview.js'

export default class BipesController {
    constructor(container) {
        // this.INIT = new Init()
        this.CODE_PREVIEW = new CodePreview()
        this.CONTROL_PREVIEW = new ControlPreview(document.getElementsByClassName('control-preview')[0])
    }
}
