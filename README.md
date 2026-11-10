# 地獄茶記 · Hell Cha Chaan Teng

面向横向投影的四枱粤语点单游戏。用桌面浏览器直接打开同目录的 **index.html** 即开档，角色、对白和动画均可离线运行。

### 双语餐牌

打开 [常餐牌](menu.html)，点击每款套餐的要求，即可看到顾客对白、英文翻译和该单的实际配料份数。请将 `index.html`、`menu.html` 和 `menu-data.js` 放在同一目录。两个页面共享同一份餐单。

四种食材是生通粉、生米、火腿和生蛋。菜单的贴图区提供这四种道具、煮锅和炒镬的独立透明 PNG。离线使用时请同时保留 assets 文件夹。

A 餐为火腿炒蛋通粉，B 餐为火腿炒蛋饭，C 餐为火腿通粉，均可配奶茶、咖啡、柠檬茶或水。D 餐为火腿炒蛋。每桌先上水，再上菜，A–C 餐最后上所点饮品。菜单可切换每款餐支持的改配。

订单提供 `ingredients`（macaroni、rice、ham、egg 的份数，省略表示零）、`eggStyle`（scrambled、boiled 或 null）、`drink`（milkTea、coffee、lemonTea、water 或 null）、套餐编号和要求标签。通粉和饭须煮熟。所有订单的 table-water 表示先上水，与 drink 独立。传感器可结合份数、熟度、饮品及上菜顺序判定，再回传结果。

### 现场使用

建议先用 16:9 画面试投。按 **F** 进入全屏，按 **H** 隐藏操作栏和店牌，再按一次恢复。通过网页服务器打开时，可在网址末尾加 `?projection` 直接进入净画面。透明页面可用于 OBS 浏览器源叠加。普通浏览器在实体投影时会自行填充透明区域，现场可用 OBS 将透明区域合成到黑底。

八款矢量街坊随机分配到四个站位。读气泡里的粤语订单，试单面板可选枱号，并分别触发「符合」和「不符」。未收到装置结果的订单满 60 秒自动成功。客人回应、离场后，每个空位独立等候约 1.5 至 7 秒再补客。

### 装置判定

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

### 粤语语音

登记回调后，每张新单都会把可朗读的粤语对白和角色资料交给回调。现场可按 `slot` 分配声音，按 `orderId` 在结单时取消过时的音频。首批已入场的顾客可用 `orders()` 读取。回调可返回 Promise，播放失败不会阻塞游戏。

```js
game.setVoiceAdapter(order => playCustomerVoice(order.text, order.customer));
// playCustomerVoice 由现场语音系统实现。
game.setVoiceAdapter(null); // 解除
```
