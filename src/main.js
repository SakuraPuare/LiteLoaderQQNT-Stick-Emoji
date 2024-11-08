const {ipcMain} = require("electron");
const fs = require("fs");
const path = require("path");
const {Config} = require("./Config");
const {pluginLog} = require("./utils/log");
const pluginPath = path.join(LiteLoader.plugins.stick_emoji.path.plugin);//插件目录
const configPath = path.join(pluginPath, "config.json");
onLoad()//妈的，启动！

module.exports.onBrowserWindowCreated = window => {
    // window 为 Electron 的 BrowserWindow


    //监听preload发来的请求webContentsID
    window.webContents.on('ipc-message-sync', (event, channel) => {
        if (channel === '___!boot') {
            event.returnValue = {
                enabled: true,
                webContentsId: window.webContents.id.toString(),
            };
        }
    });
}

function onLoad() {
    pluginLog("启动！")

    ipcMain.handle("LiteLoader.stick_emoji.getMenuHTML", () => fs.readFileSync(path.join(config.pluginPath, 'src/pluginMenu.html'), 'utf-8'))
    ipcMain.handle("LiteLoader.stick_emoji.getConfig", () => Config.getConfig())
    ipcMain.handle("LiteLoader.stick_emoji.setConfig", async (event, newConfig) => Config.setConfig(newConfig))//更新配置，并且返回新的配置


    //设置配置
    Config.initConfig(pluginPath, configPath)
}