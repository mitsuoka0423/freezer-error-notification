import * as line from '@line/bot-sdk';
import SwitchBot from "@lucadiba/switchbot-client";

const lineClient = new line.messagingApi.MessagingApiClient({
  channelAccessToken: Bun.env.LINE_CHANNEL_ACCESS_TOKEN || "",
});

const switchbot = new SwitchBot({
  openToken: Bun.env.SWITCH_BOT_TOKEN || "",
  secretKey: Bun.env.SWITCH_BOT_CLIENT_SECRET || "",
});

console.log('冷凍庫の温度を取得します');

const meter = await switchbot.meter("E05C356C390D");
const temperatue = await meter.getTemperature();
const humidity = await meter.getHumidity();

console.log({ temperatue, humidity });

if (temperatue < -5) {
  console.log("問題なし");
} else {
  await lineClient.broadcast({
    messages: [{
      type: "flex",
      altText: "冷凍庫温度上昇アラート",
      contents: {
        "type": "bubble",
        "hero": {
          "type": "image",
          "url": "https://i.ibb.co/WVY4RKg/alert.png",
          "aspectMode": "fit",
          "offsetTop": "10px"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "温度上昇アラート！",
              "weight": "bold",
              "size": "xl"
            },
            {
              "type": "box",
              "layout": "vertical",
              "margin": "lg",
              "spacing": "sm",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "冷凍庫の温度が上がっています",
                      "wrap": true,
                      "color": "#666666",
                      "size": "sm",
                      "flex": 5
                    }
                  ]
                },
                {
                  "type": "separator",
                  "margin": "10px"
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "現在の温度",
                      "color": "#aaaaaa",
                      "size": "sm",
                      "flex": 2
                    },
                    {
                      "type": "text",
                      "text": `${temperatue}℃`,
                      "wrap": true,
                      "color": "#666666",
                      "size": "sm",
                      "flex": 4
                    }
                  ],
                  "margin": "10px"
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "正常温度",
                      "color": "#aaaaaa",
                      "size": "sm",
                      "flex": 2
                    },
                    {
                      "type": "text",
                      "text": "-15〜-20℃",
                      "wrap": true,
                      "color": "#666666",
                      "size": "sm",
                      "flex": 4
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    }]
  });
  console.log("LINEにメッセージを送信しました");
}
