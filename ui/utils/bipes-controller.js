import Common from '../components/common'
import CodePreview from '../components/code-preview.js'
import ControlPreview from '../components/control-preview.js'
import SettingPreview from '../components/setting-preview.js'
import DrawPreview from '../components/draw-preview.js'
import SearchDevice from '../components/search-device.js'
import ExtensionsBtn from '../components/extensions-btn.js'
import ExtensionsDialog from '../components/extensions-dialog.js'

import SkulptController from './skulpt-controller.js'
import EventEmitterController from './event-emitter-controller.js'

export default class BipesController extends Common {
    constructor() {
        super()
        this.SKULPT_CONSTROLER = new SkulptController()

        this.CODE_PREVIEW = new CodePreview()
        this.CONTROL_PREVIEW = new ControlPreview()
        this.SETTING_PREVIEW = new SettingPreview()
        this.DRAW_PREVIEW = new DrawPreview()
        this.SEARCH_DEVICE = null
        this.EXTENSIONS_DIALOG = null

        this._settings = this.getLocalSettings()

        this.EXTENSIONS_BTN = new ExtensionsBtn({
            settings: this._settings
        })

        EventEmitterController.on('extensions-dialog-change', (state) => {
            if (state) {
                this.openExtensionsDialog()
            }
        })
        EventEmitterController.on('reset-mode', async (mode) => {
            if (['hardware', 'offline'].includes(mode)) {
                // 重置toolbox
                if (this.EXTENSIONS_DIALOG) {
                    await this.EXTENSIONS_DIALOG.resetToolbox()
                }
            }
            
            // 重置扩展按钮
            $('#extensions-btn').css('display', mode === 'turtle' ? 'block' : 'none')
            this.EXTENSIONS_BTN.resetPostion()
        })
    }

    initEvent() {
        // 运行按钮
        $('#bipes-run').on('click', this.bipesRun.bind(this))
        // 搜索按钮
        $('#scanButton').on('click', this.openSearchDevice.bind(this))
    }
    
    // 运行 
    bipesRun() {
        let { mode } = this.getLocalSettings()
        switch(mode) {
            case 'hardware':
                UI['workspace'].run()
                break;
            case 'offline':
                EventEmitterController.emit('open-control-preview')
                this.SKULPT_CONSTROLER.runPythonCode()
                break;
            case 'turtle':
                EventEmitterController.emit('open-draw-preview')
                setTimeout(() => {
                    this.SKULPT_CONSTROLER.runSkulptCode()
                })
                break;
            default:
                break;
        }
    }
    /**
     * 配置信息
     */
    getLocalSettings() {
        let settings = null
        try {
            const storedSettings = localStorage.getItem('settings')
            if (storedSettings) {
                settings = JSON.parse(storedSettings)
                this.SETTING_PREVIEW.updateView(settings.mode)
            } else {
                settings = { mode: 'hardware' }
                localStorage.setItem('settings', JSON.stringify(settings))
                this.SETTING_PREVIEW.updateView('hardware')
            }
            return settings
        } catch (error) {
            console.error('获取本地缓存设置失败:', error)
            settings = { mode: 'hardware' }
            return settings
        }
    }
    getSettings() {
        return this._settings;
    }
    // 构建搜索设备
    openSearchDevice() {
        if (!this.SEARCH_DEVICE) this.SEARCH_DEVICE = new SearchDevice()
        
        $('body').append(this.SEARCH_DEVICE.render())
        this.SEARCH_DEVICE.initEvent()
    }
    // 显示扩展弹窗
    openExtensionsDialog() {
        if (!this.EXTENSIONS_DIALOG) this.EXTENSIONS_DIALOG = new ExtensionsDialog()
        
        this.EXTENSIONS_DIALOG.show()
    }
}
