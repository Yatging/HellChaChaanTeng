地獄茶記 · 本地美術素材包
Hell Cha Chaan Teng · Art asset pack · 2026-11-22

01_Customers
8 位顧客，4 位原有顧客與 4 位新增顧客。統一透明畫布 1024 × 1280，角色置中。
原有顧客原始解析度檔案另存於 10_Existing_Archive。

02_Backgrounds
background_customer_four_tables.png 為新繪背景，下方四張空桌依序對應四個顧客。
桌面空白可投影餐點，上方木框牌留白可後加文字。
background_customer_original.png 保留提供的原始背景。

03_Food_Only
18 款 A–D 餐與改配。全部只包含餐點及餐具。
regular = 標準；no_egg = 走蛋；boiled = 烚蛋；extra_ham = 加腿。
A 腿蛋通，B 腿蛋飯，C 腿通，D 腿蛋。複合改配用底線串接。

04_Drinks_Only
7 款飲品。hot_regular = 標準熱飲；condensed = 茶走；
black = 飛沙走奶；extraLemon = 加檸；water_regular = 清水。
凍飲舊檔留在 10_Existing_Archive。

05_Ingredients_Bulk
生米、生通粉、生蛋、火腿四張大盤。密集食堂備料盤，透明背景。

06_Cookware
空水鍋、空炒鑊俯視圖，及空碗、空碟。

07_Cooking_States
5 組烹飪，每組 01_raw、02_cooking、03_cooked。
pot_egg / pot_macaroni / pot_rice 為煮蛋、通粉、米。
wok_scrambled / wok_ham 為炒蛋、煎火腿。
每組鏡頭與鍋具位置一致。原料入水、冒泡、變熟及鍋內完成狀態皆可使用。
烚蛋的鍋內熟成使用完整蛋殼，剝開的蛋另見 09。

08_Cooking_Animation
5 組各 12 幀透明 PNG，frame_00 到 frame_11 依序由生到熟。
建議 4 fps 播 3 秒，最後一幀停住等出餐。若要更久煮，重播中間幀。
全幀為 1024 × 1024，相同鍋具錨點，直接替換貼圖。

09_Raw_And_Cooked
獨立原料、熟食小圖，可做取料與轉移動畫。

10_Existing_Archive
本次提供的原始顧客、單據背景及網頁既有素材原檔。
這一區有早期餐飲合圖與不同尺寸，正式拆圖優先用 03 與 04。
截圖中的 StartingScene 與 Order_Back 原檔未包含在 customer.zip，
包內僅保留能取得的帶單據背景，不含從截圖截取的低清替代品。

11_Preview
分組總覽，供選圖使用。預覽底色只存在總覽，獨立圖保有透明度。

格式與使用
新繪餐點／食材／鍋具／烹飪 PNG 為 1024 × 1024，透明背景。
顧客為 1024 × 1280，透明背景；新背景保持生成原尺寸。
ASSET_INDEX.csv 提供中英名稱、來源、尺寸、透明度；manifest.json 同步提供。
顧客與背景用內建 ImageGen 依參考生成。餐點與食材沿用原有可編輯繪圖，
另補足盤量、獨立匯出與烹飪序列。提示詞見 GENERATION_PROMPTS.txt。

v2 更新 · 2026-11-23
12_Contents_Only 為實體鍋具投影版本，只有水面、食材和冒泡效果。
5 組各有 00_raw、01_cooking 快照、02_cooked，以及 16 幀獨立循環。
先播生料，開始加熱後重播循環，熟成信號來時直接切完成圖。
循環可任意延長。詳見該目錄的 使用说明.txt 和 PLAYBACK.json。
本版共 247 張 PNG，新增 96 張內容貼圖及 1 張總覽。
