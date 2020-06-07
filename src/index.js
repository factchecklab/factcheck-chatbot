const dotenv = require('dotenv');

const api = require('./api');
const {
  parseContentFromCtx,
  fromTopic,
  UnsupportedMessageTypeError,
} = require('./helper/message');

dotenv.config();

const DEFAULT_STATE = {
  report: { data: null, pendingCreate: false, cancelCreate: false },
};

module.exports = async function App(context) {
  try {
    const content = parseContentFromCtx(context);
    if (content.forceCreate) {
      await api.createReport(content.data);
      await context.sendText('感謝您的反饋。我們會儘快查證此則內容。');
      context.setState(DEFAULT_STATE);
      return;
    }
    if (content.cancelCreate) {
      await context.sendText('感謝您使用 Factcheck Lab。');
      context.setState(DEFAULT_STATE);
      return;
    }

    const topics = await api.similarTopics(content.data);
    if (topics.length === 0) {
      context.setState({
        report: {
          data: content.data,
          pendingCreate: true,
        },
      });
      await context.sendButtonTemplate(
        `我們沒有找到相關的消息。請問你想回報此則新聞予我們查證嗎？`,
        [
          {
            type: 'postback',
            title: '好',
            payload: 'CreateReport',
          },
          {
            type: 'postback',
            title: '先不要',
            payload: 'CancelCreateReport',
          },
        ]
      );
    } else {
      const topic = topics[0];
      const responseText = fromTopic(topic);
      await context.sendText(responseText);
    }
  } catch (err) {
    if (err instanceof UnsupportedMessageTypeError) {
      await context.sendText('很抱歉，我們暫時只支援文字及連結消息。');
    } else {
      console.error(err);
      await context.sendText('出現未知錯誤。');
    }
  }
};
