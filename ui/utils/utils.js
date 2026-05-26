// 重置扩展按钮位置
export function resetPostion() {
    let dom = document.getElementsByClassName('blocklyToolboxContents')
    if (dom.length > 0) {
        let h = document.body.offsetHeight - 52 - 54 - 23 // 页面高度 - 顶部高度 - 按钮高度

        let b_h = 0
        let len = dom[0].children.length
        b_h = len * 60
        
        let top = 0
        if (h > b_h) top = b_h
        else top = h

        $('#extensions-btn').css({
            top: top + 'px'
        })
    }
}

// 初始化智能体
export function initCoze() {
    return CozeWebSDK?.WebChatClient ? 
        new CozeWebSDK.WebChatClient({
            config: {
                // 智能体 ID
                botId: '7644114627365732371'
            },
            auth: {
                // 鉴权方式，默认type 为unauth，表示不鉴权；建议设置为 token，表示通过PAT或OAuth鉴权
                type: 'token',
                // type 为 token 时，需要设置PAT或OAuth访问密钥
                token: 'pat_BAwId1jOm3A3W3JEEgDYngs2D27XL2tWukp4q9x7arp8hZKQw3QyIn6Sez8u4Y2U',
                // 访问密钥过期时，使用的新密钥，可以按需设置。
                onRefreshToken: async () => 'pat_BAwId1jOm3A3W3JEEgDYngs2D27XL2tWukp4q9x7arp8hZKQw3QyIn6Sez8u4Y2U'
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
    : null
}
