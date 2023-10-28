import * as line from '@line/bot-sdk';
import SwitchBot from "@lucadiba/switchbot-client";

const lineClient = new line.messagingApi.MessagingApiClient({
  channelAccessToken: Bun.env.LINE_CHANNEL_ACCESS_TOKEN || "",
});

const switchbot = new SwitchBot({
  openToken: Bun.env.SWITCH_BOT_TOKEN || "",
  secretKey: Bun.env.SWITCH_BOT_CLIENT_SECRET || "",
});

const meter = await switchbot.meter("E05C356C390D");
const temperatue = await meter.getTemperature();
const humidity = await meter.getHumidity();

console.log({
  temperatue, humidity
});

if (temperatue > -5) {
  await lineClient.broadcast({
    messages: [{
      type: "text",
      text: `冷凍庫の温度が上がっています。確認してください。\n温度: ${temperatue}`
    }]
  });
}
