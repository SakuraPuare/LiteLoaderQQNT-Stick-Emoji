import {pluginLog} from "./frontLog.js";
import {stickEmojiOther} from "./stickEmoji.js";

/**
 * 右键菜单插入功能方法，
 * @param {Element} rightClickMenu 右键菜单元素
 * @param {String} icon SVG字符串
 * @param {String} title 选项显示名称
 * @param {Function} callback 回调函数
 */
function createMenuItemSE(rightClickMenu, icon, title, callback) {
    if (rightClickMenu.querySelector("#menuItem-SE") != null) return;//如果已经有了就不加了直接

    const element = document.createElement("div");//复制本来的右键菜单栏
    element.innerHTML = document
        .querySelector(`.q-context-menu`)
        .outerHTML.replace(/<!---->/g, "");
    // console.log('EC-createMenuItemEC中创建的element如下')
    // console.log(element)
    //这里做了改动，以前是直接用的firstChild，但是新版QQ右键菜单栏第一个子元素是一行表情
    const item = element.querySelector(".q-context-menu-item")
    // console.log(item)
    item.id = "menu-item-SE";
    if (item.querySelector(".q-icon")) {
        item.querySelector(".q-icon").innerHTML = icon;
    }
    if (item.classList.contains("q-context-menu-item__text")) {
        item.innerText = title;
    } else {
        item.querySelector(".q-context-menu-item__text").innerText = title;
    }
    item.addEventListener("click", () => {
        callback();
        rightClickMenu.remove();
    });
    rightClickMenu.appendChild(item);
}

/**
 * 右键菜单监听
 */
export function listenMenu() {
    pluginLog("准备添加右键菜单项")
    let messageContainer__avatar = null;
    //监听鼠标点击，根据情况插入功能栏
    document.addEventListener("mouseup", (event) => {
        if (event.button === 2) {//如果是鼠标右键
            messageContainer__avatar = event.target;
            let targetClasses = ["message-container__avatar", "msg-content-container", "message-content", "image-content", "text-normal"]
            if (!targetClasses.some(className => messageContainer__avatar?.classList?.contains(className))) //不符合就直接返回
            {
                messageContainer__avatar = null;
                //pluginLog("右键元素不符合，直接返回")
            }
        }
    });

    new MutationObserver(() => {
        const qContextMenu = document.querySelector(".q-context-menu");//右键菜单元素

        if (qContextMenu && messageContainer__avatar) {
            createMenuItemSE(
                qContextMenu,
                `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
<path d="M480-480Zm.07 380q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.93-148.21 29.92-69.37 81.22-120.68t120.65-81.25Q401.15-860 480-860q41.46 0 80.31 8.31 38.84 8.31 74.3 24.31v67.3q-34.23-18.84-73.23-29.38Q522.38-800 480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-30.46-5.73-59.12-5.73-28.65-15.96-55.49h64.46q8.61 27.46 12.92 55.71Q860-510.65 860-480q0 78.85-29.92 148.2t-81.21 120.65q-51.29 51.3-120.63 81.22Q558.9-100 480.07-100ZM810-690v-80h-80v-60h80v-80h60v80h80v60h-80v80h-60ZM616.24-527.69q21.84 0 37.03-15.29 15.19-15.28 15.19-37.11t-15.28-37.02q-15.28-15.2-37.12-15.2-21.83 0-37.02 15.29-15.19 15.28-15.19 37.11t15.28 37.02q15.28 15.2 37.11 15.2Zm-272.3 0q21.83 0 37.02-15.29 15.19-15.28 15.19-37.11t-15.28-37.02q-15.28-15.2-37.11-15.2-21.84 0-37.03 15.29-15.19 15.28-15.19 37.11t15.28 37.02q15.28 15.2 37.12 15.2ZM480-272.31q63.18 0 114.74-35.04 51.57-35.04 76.18-92.65H289.08q24.61 57.61 76.18 92.65 51.56 35.04 114.74 35.04Z"/></svg>`,
                "贴表情",
                async () => {
                    try {
                        //在这里实现贴表情前的准备工作
                        const msgId = messageContainer__avatar.closest(".ml-item").id
                        //先根据msgId找到对应的消息
                        let targetMsg = undefined
                        for (const message of app.__vue_app__.config.globalProperties.$store.state.aio_chatMsgArea.msgListRef.curMsgs) {
                            if (message.msgId === msgId) {
                                targetMsg = message
                                break
                            }
                        }

                        await stickEmojiOther(targetMsg.data.chatType, targetMsg.data.peerUid, targetMsg.data.msgSeq)
                    } catch (e) {

                    }
                }
            );
        }
    }).observe(document.querySelector("body"), {childList: true});
}

