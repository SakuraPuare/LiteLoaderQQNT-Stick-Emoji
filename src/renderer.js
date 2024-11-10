// 运行在 Electron 渲染进程 下的页面脚本

import {pluginLog} from "./utils/frontLog.js";
import {listenMenu} from "./utils/rightClickMenu.js";
import {getRandomInt} from "./utils/math.js";
import {stickEmojiSelf} from "./utils/stickEmojiSelf.js";
import {retry} from "./utils/retry.js";

const pluginAPI = window.stick_emoji
await onLoad();//注入

// 打开设置界面时触发
export const onSettingWindowCreated = view => {
    // view 为 Element 对象，修改将同步到插件设置界面
}

async function onLoad() {
    if (location.hash === "#/blank") {
        navigation.addEventListener("navigatesuccess", onHashUpdate, {once: true});
    } else {
        await onHashUpdate();
    }

    pluginLog('onLoad函数加载完成')
}

async function onHashUpdate() {
    const hash = location.hash;
    if (hash === '#/blank') return
    if (!(hash.includes("#/main/message") || hash.includes("#/chat"))) return;//不符合条件直接返回

    pluginLog('执行onHashUpdate')
    //"nodeIKernelMsgListener/onAddSendMsg"
    //"nodeIKernelMsgListener/onRecvMsg"
    try {
        const listener1 = pluginAPI.subscribeEvent('nodeIKernelMsgListener/onMsgInfoListUpdate',
            async (payload) => {
                console.log(payload)
                await retry(() => stickEmojiSelf(payload), 10, 150)
            })
        listenMenu()
        pluginLog("事件监听成功")
    } catch (e) {
        pluginLog(e)
        setInterval((e) => console.log(e), 1000)
    }
}