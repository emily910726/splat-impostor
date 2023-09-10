# splat-impostor

## Pre-requisies
node js and npm

## How to start the bot
1. Invite the bot to your server https://discord.com/api/oauth2/authorize?client_id=1150337017947885608&permissions=8&scope=bot%20applications.commands
2. Download the code
3. In the .env file, paste your token in
4. Run the program with `npm start`

## How does the bot work
1. `!create` to create a room
2. Players type in `!joinA` or `!joinB` to join a team
3. When everyone joins a team, type !start to get team compositions, everyone will receive a private message from the splat-impostor telling you whether you are a player, or an impostor
4. When the game finishes, type in !end to reveal the results.

1. `!create` 开始一场新的谁是卧底游戏
2. 每个人根据游戏分组，输入`!joinA` 或者`!joinB`
3. 当所有人都加入分组之后，输入`!start` 开始卧底分配，每个人都会收到splat-impostor的私信，告诉你你是player还是impostor
4. 游戏结束后，输入`!end` 来公示结果