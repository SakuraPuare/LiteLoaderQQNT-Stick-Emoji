// 运行在 Electron 渲染进程 下的页面脚本

import {pluginLog} from "./utils/frontLog.js";
import {listenMenu} from "./utils/rightClickMenu.js";

const seAPI = window.stick_emoji
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
        //grabRedBagListener = grAPI.subscribeEvent("nodeIKernelMsgListener/onRecvActiveMsg", (payload) => grabRedBag(payload))
        listenMenu()
        pluginLog("事件监听成功")

        //尝试获取群列表


    } catch (e) {
        console.log(e)
    }
}
