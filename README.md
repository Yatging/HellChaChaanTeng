# 地獄茶記 · Hell Cha Chaan Teng

面向横向投影的四枱粤语点单游戏。用桌面浏览器直接打开同目录的 **index.html** 即开档，角色、对白和动画均可离线运行。

### 双语餐牌

打开 [常餐牌](menu.html)，点击每款套餐的要求，即可看到顾客对白、英文翻译和该单的实际配料份数。请将 `index.html`、`menu.html` 和 `menu-data.js` 放在同一目录。两个页面共享同一份餐单。

四种食材是生通粉、生米、火腿和生蛋。菜单的贴图区提供这四种道具、煮锅和炒镬的独立透明 PNG。离线使用时请同时保留 assets 文件夹。

离线餐牌还需要同目录的 `menu-art.js` 和 `menu-ui.js`。餐卡可按当前选择导出透明 PNG，页面底部列出全部 102 种有效组合。奶茶、咖啡、柠檬茶目前仅提供热饮，另可分别选茶走、飞沙走奶或加柠。冻饮的已有图片文件和绘图代码保留在项目里。适用的套餐可将加腿与走蛋或转烚蛋叠加。

A 餐为火腿炒蛋通粉，B 餐为火腿炒蛋饭，C 餐为火腿通粉，均可配奶茶、咖啡、柠檬茶或水。D 餐为火腿炒蛋。每桌先上水，再上菜，A–C 餐最后上所点饮品。菜单可切换每款餐支持的改配。

订单提供 `ingredients`（macaroni、rice、ham、egg 的份数，省略表示零）、`eggStyle`（scrambled、boiled 或 null）、`drink`（milkTea、coffee、lemonTea、water 或 null）、套餐编号和要求标签。通粉和饭须煮熟。所有订单的 table-water 表示先上水，与 drink 独立。传感器可结合份数、熟度、饮品及上菜顺序判定，再回传结果。

### 现场使用

投影订单还提供 `temperature`（hot 或 null）、`drinkPrep`（regular、condensed、black、extraLemon 或 null）以及 `combination`（与餐牌组合图下载文件名对应，省略 .png）。清水不指定温度，D 餐没有配饮。

### 三台电脑与三路投影

左侧灶台、上方四桌、右侧原料分别对应 `tables.html?view=stove`、`tables.html?view=tables`、`tables.html?view=ingredients`。三个窗口裁切同一套布局，保留灶台至客桌的坐标对应。

三台电脑连接同一局域网。在其中一台电脑安装 Node.js 22 或更新版本，下载并解压本仓库，双击 `start-lan.cmd`，或在文件夹运行 `node lan-server.cjs`。打开窗口显示的 http://localhost:8080/，入口页会列出其他电脑应访问的局域网网址，例如 http://192.168.1.20:8080/。Windows 首次询问防火墙时允许私有网络访问。各投影电脑从同一个入口打开自己的投影区域。

在任一电脑上额外打开一个入口页中的「顾客与控制」窗口，并保持运行。它负责订单和烹调，三个投影窗口负责显示。NFC 接口可以在任一已连接窗口调用。电脑的日期时间差异会自动换算。网络断开时画面显示等待连接，恢复后自动重连并获取当前状态；顾客控制页刷新会开始一轮新订单。

GitHub Pages 上的公开链接可用于预览和同浏览器同步。跨电脑试投使用上述局域网入口及带有 `lan=1` 的链接。局域网运行无需互联网，端口默认 8080。

建议先用 16:9 画面试投。按 **F** 进入全屏，按 **H** 隐藏操作栏和店牌，再按一次恢复。通过网页服务器打开时，可在网址末尾加 `?projection` 直接进入净画面。透明页面可用于 OBS 浏览器源叠加。普通浏览器在实体投影时会自行填充透明区域，现场可用 OBS 将透明区域合成到黑底。

八款矢量街坊随机分配到四个站位。读气泡里的粤语订单，试单面板可选枱号，并分别触发「符合」和「不符」。未收到装置结果的订单满 60 秒自动成功。客人回应、离场后，每个空位独立等候约 1.5 至 7 秒再补客。

### 装置判定

**双投影**　用同一台电脑、同一浏览器配置打开一个顾客窗口与一个 [桌面窗口](tables.html)。把两个窗口分别移到对应投影机上，按 F 全屏、H 隐藏界面；也可用 `tables.html?projection` 直接进入透明净画面。桌号从左到右一一对应。两页须使用同一 HTTPS 站点，或同一本地 HTTP 服务。桌面页可先开，也可在用餐中重开，会按顾客页的订单和已过时间恢复。顾客页提供唯一的订单与计时。

默认接单 60 秒自动上菜。整份出品先展示 1.5 秒，接着用 6.5 秒吃完，空餐具停留 1.5 秒，再用 1 秒淡出。顾客等本桌餐具消失后离开。判错的订单不上菜。接入硬件时，在顾客页调用 `ChaChaanTeng.setAutoServe(false)` 关闭自动上菜；使用下方 `resolveOrder` 接口，或在桌面页读取 `ChaChaanTables.orders()`，再调用 `ChaChaanTables.judge(orderId, matched)` 将布尔判定传回顾客页。顾客页只接受仍在等待的订单。传入 `setAutoServe(true)` 可恢复演示。

每次入场触发 `cct:order`。载入后接入的控制器可调用 `orders()` 获取正在等待的订单。每单包含 `slot`（1 至 4）、`orderId`、`customer`、`text`、`requirements`（饮食需求标签）和 `dueAt`（演示截止时间，Unix 毫秒）。

```js
const game = window.ChaChaanTeng;
const order = game.orders()[0];
// 由你的硬件桥接程序读取传感器，判断本单 requirements 是否满足。
game.resolveOrder(order.orderId, true);  // 满意
// 或派发事件。matched 必须为布尔值，已结单或旧编号会被忽略。
window.dispatchEvent(new CustomEvent('cct:judge', {
  detail: { orderId: order.orderId, matched: false }
}));
window.addEventListener('cct:result', e => console.log(e.detail));
```

### 灶台投影与 NFC

桌面页内的 U 形区按草图 3 m × 2.5 m 的外轮廓等比缩放。上沿四张客桌由左到右为 1–4，左翼饮品道具位留空，下面依次为 pot-1、pot-2、wok。右翼为通粉、米、蛋和火腿。每张订单按自身配方取料，共用灶位排队。煮锅加工通粉、米和烚蛋，炒镬炒蛋或煎火腿。加腿投两份，走蛋跳过蛋。材料处理好后在出餐位组合，等待放行。自动模式在接单满 60 秒且菜已做好时出餐，送餐动画用 1.8 秒，抵桌后才开始用餐。

默认 demo 假定锅具在位。硬件桥接程序可以在**顾客页或已连线的桌面页**调用下列接口。sensor 模式以各灶位的在位读数为准，初始均为 false。移锅暂停该灶位的进度，放回继续。重复上报同一读数不会重新计时。读卡器断连时，桥接程序应为受影响灶位上报 false。

```js
const stove = window.ChaChaanKitchen;
stove.setMode('sensor');
stove.setVesselPresent('pot-1', true);  // NFC 检出锅
stove.setVesselPresent('pot-1', false); // 锅已移开
// 也支持事件形式
window.dispatchEvent(new CustomEvent('cct:vessel', {
  detail: {stationId:'wok', present:true}
}));
stove.state(); // 模式、灶位、当前工序、进度和已完成的配料
stove.setMode('demo'); // 恢复自动演示
```

锅具在位和上菜许可独立。要由装置决定何时上菜，在顾客页调用 `ChaChaanTeng.setAutoServe(false)` 关闭定时上菜，再使用订单编号提交判定；提前收到的成功判定会等菜做好，失败判定会取消该单并释放灶位。桌面页的接口返回值表示消息是否已发出，以 `state()` 读回的顾客页状态为准。

### 粤语语音

登记回调后，每张新单都会把可朗读的粤语对白和角色资料交给回调。现场可按 `slot` 分配声音，按 `orderId` 在结单时取消过时的音频。首批已入场的顾客可用 `orders()` 读取。回调可返回 Promise，播放失败不会阻塞游戏。

```js
game.setVoiceAdapter(order => playCustomerVoice(order.text, order.customer));
// playCustomerVoice 由现场语音系统实现。
game.setVoiceAdapter(null); // 解除
```
