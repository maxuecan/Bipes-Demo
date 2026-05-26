import Common from '@/components/common'
import CodePreview from '@/components/code-preview.js'
import ControlPreview from '@/components/control-preview.js'
import SettingPreview from '@/components/setting-preview.js'
import DrawPreview from '@/components/draw-preview.js'
import SearchDevice from '@/components/search-device.js'
import ExtensionsBtn from '@/components/extensions-btn.js'
import ExtensionsDialog from '@/components/extensions-dialog.js'
import ExamplePreview from '@/components/example-preview.js'

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
        this.EXAMPLE_PREVIEW = new ExamplePreview({
            getLocalSettings: this.getLocalSettings
        })
        this.SEARCH_DEVICE = null
        this.EXTENSIONS_DIALOG = null

        this.COZE = this.initCoze()

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

            // 重置案例内容
            this.EXAMPLE_PREVIEW.reload(mode)
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
                if (this.SETTING_PREVIEW) this.SETTING_PREVIEW.updateView(settings.mode)
            } else {
                settings = { mode: 'hardware' }
                localStorage.setItem('settings', JSON.stringify(settings))
                if (this.SETTING_PREVIEW) this.SETTING_PREVIEW.updateView('hardware')
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

    // 初始化智能体
    initCoze() {
        return new CozeWebSDK.WebChatClient({
            config: {
                // 智能体 ID
                botId: '7504853922646360103'
            },
            auth: {
                // 鉴权方式，默认type 为unauth，表示不鉴权；建议设置为 token，表示通过PAT或OAuth鉴权
                type: 'token',
                // type 为 token 时，需要设置PAT或OAuth访问密钥
                token: 'pat_2qNEOaWYB7H2zt5aPahFF01OWlzq0QI1dYUI5V6bBdj7mdrKugweZMLp7UfXBUNy',
                // 访问密钥过期时，使用的新密钥，可以按需设置。
                onRefreshToken: async () => 'pat_2qNEOaWYB7H2zt5aPahFF01OWlzq0QI1dYUI5V6bBdj7mdrKugweZMLp7UfXBUNy'
            },
            // 用户信息
            // userInfo: {
            //     id: '',
            //     url: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
            //     nickname: ''
            // },
            ui: {
                // base: {
                //   icon: '', // 应用图标，默认扣子图标
                //   layout: '', // mobile pc，默认自动识别
                //   lang: '', // 语言en zh-CN，默认英语
                //   zIndex: 9999, // 层级
                // },
                // header: {
                //   isShow: true, // 是否展示顶部标题栏
                //   isNeedClose: true, // 是否展示右上角的关闭页面按钮
                // },
                // asstBtn: {
                //   isNeed: true, // 浮动球，true 显示， false 不显示（显示聊天框：cozeWebSDK.showChatBot()，隐藏聊天框：cozeWebSDK.hideChatBot()）
                // },
                // footer: {
                //   isShow: true, // 是否展示底部文案模块。
                //   expressionText: 'Powered by {{name}}&{{name1}}', // 底部显示的文案信息
                //   linkvars: {
                //     name: {
                //       text: 'A',
                //       link: 'https://www.test1.com'
                //     },
                //     name1: {
                //       text: 'B',
                //       link: 'https://www.test2.com'
                //     }
                //   }, // 底部文案中的链接文案与链接地址
                // },
                chatBot: {
                    title: '智能客服', // 聊天框的标题
                    uploadable: true, // 是否开启聊天框的上传能力。
                    // width: '', // PC 端窗口的宽度，单位为 px，默认为 460。
                    // el: '', // 设置聊天框放置位置的容器（Element）
                    // onHide: () => {}, // 当聊天框隐藏的时候，会回调该方法
                    // onShow: () => {}, // 当聊天框显示的时候，会回调该方法
                    // onBeforeShow: () => {}, //  聊天框显示前调用
                    // onBeforeHide: () => {}, //  聊天框隐藏前调用
                },
            },
        })
    }
}
