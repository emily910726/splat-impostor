# splat-impostor

## Pre-requisies
node js and npm

## How to start the bot
1. Invite the bot to your server https://discord.com/api/oauth2/authorize?client_id=1150337017947885608&permissions=8&scope=bot%20applications.commands
2. Download the code
3. In the .env file, paste your token in
4. Run the program with `npm start`

## How does the bot work

### Quick Start 快速随机武器游戏 (without creating a room 不需要创建房间)
Type `!qs` to start a quick random weapon room

Option： You can also start a quick random weapon room with different mode (how weapons will be allocated):
   `!qs strict` (similiar to x rank matchmaking mechanism)
   `!qs lax` (a bit less strict than x rank matchmaking mechanism)
   `!qs class` (strict matchmaking based on weapon class, for example, if team A has a roller, a bucket, a sniper and a shooter, team b will also have a roller, a bucket a sniper and a shooter)


`!qs` 开始随机抽取武器，地图和模式 （游戏开始）
也可以快速开始不同模式的随机武器抽取：
   `!qs strict` (类似于X段排位战的武器分配机制)
   `!qs lax` (比X段位排位站的匹配稍微更不严格一点的武器分配)
   `!qs class` (完全根据武器类别来分配武器，比如，如果A组有一个滚筒，一个狙，一个弓，一把自动枪，那B组也会有完全一样的武器类别组合)


### Impostor room 谁是卧底房间
1. `!create` to create a room
2. Players type in `!join A` or `!join B` to join a team
3. When everyone joins a team, type `!start` to get team compositions, everyone will receive a private message from the splat-impostor telling you whether you are a player, or an impostor
4. When the game finishes, type in `!end` to reveal the results.

1. `!create` 开始一场新的谁是卧底游戏
2. 每个人根据游戏分组，输入`!join A` 或者`!join B`
3. 当所有人都加入分组之后，输入`!start` 开始卧底分配，每个人都会收到splat-impostor的私信，告诉你你是player还是impostor
4. 游戏结束后，输入`!end` 来公示结果

### Impostor with random weapons 谁是卧底随机武器
1. `!create` to create a room
2. Players type in `!join A` or `!join B` to join a team
3. When everyone joins a team, type `!start im random` to get team compositions, and random weapons/map/mode, everyone will receive a private message from the splat-impostor telling you whether you are a player, or an impostor
4. When the game finishes, type in `!end` to reveal the results.
Similar to quick start, you can also start the room with different mode by using:
   `!start im random strict`
   `!start im random lax` 
   `!start im random class` 

1. `!create` 开始一场新的谁是卧底游戏
2. 每个人根据游戏分组，输入`!join A` 或者`!join B`
3. 当所有人都加入分组之后，输入`!start im random` 开始卧底分配，每个人都会收到splat-impostor的私信，告诉你你是player还是impostor，同时公布随机武器，地图和模式
4. 游戏结束后，输入`!end` 来公示结果
与快速随机武器模式类似，随机武器房间也可以开始不同的模式：
   `!start im random strict`
   `!start im random lax`
   `!start im random class`


### Start a random weapon room with player's name allocated to each weapon 创建随机武器房间
Similar to quick start, you can start a random weapon room with players joining the room too.
1. `!create` to create a room
2. Players type in `!join A` or `!join B` to join a team
3. When everyone joins a room, type `!start vs random` to get a random match with map, mode randomised, and random weapons allocated to every player
   Similar to quick start, you can also start the room with different mode by using:
   `!start vs random strict`
   `!start vs random lax`
   `!start vs random class`
4. When the game finishes, type in `!end` to finish the game.

类似于快速游戏，玩家也可以创建房间，武器分配会分配到每一个玩家
1. `!create` 来创建一个新房间
2. 每个人根据游戏分组，输入`!join A` 或者`!join B`
3. 当所有人加入分组后，输入`!start vs random`来开始一场随机武器，随机地图，随机模式的游戏，每一个玩家会拿到属于自己的武器
与快速随机武器模式类似，随机武器房间也可以开始不同的模式：
   `!start vs random strict`
   `!start vs random lax`
   `!start vs random class`
4. 游戏结束后，输入`!end`来结束房间