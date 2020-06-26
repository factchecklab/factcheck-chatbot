const dotenv = require('dotenv');

const api = require('./api');
const {
  parseContentFromCtx,
  fromReport,
  UnsupportedMessageTypeError,
} = require('./helper/message');

dotenv.config();

const DEFAULT_STATE = {
  topic: {
    message: null,
    url: null,
    pendingCreate: false,
    cancelCreate: false,
    logFeedback: false,
  },
};

module.exports = async function App(context) {
  try {
    const content = parseContentFromCtx(context);
    if (content.logFeedback) {
      console.info(JSON.stringify(content));
    }
    if (content.forceCreate) {
      await api.submitTopic(content.message, content.url);
      await context.sendText('感謝您的反饋。我們會儘快查證此則內容。');
      context.setState(DEFAULT_STATE);
      return;
    }
    if (content.cancelCreate) {
      await context.sendText('感謝您使用事實查核小助手。');
      context.setState(DEFAULT_STATE);
      return;
    }

    const { message, url } = content;
    const reports = await api.searchRelatedReports(message, url);
    context.setState({ topic: { message, url, pendingCreate: true } });

    if (reports.length === 0) {
      await context.sendButtonTemplate(
        `我們沒有找到相關的消息。請問你想回報此則新聞予我們查證嗎？`,
        [
          {
            type: 'postback',
            title: '好',
            payload: 'CreateTopic',
          },
          {
            type: 'postback',
            title: '先不要',
            payload: 'CancelCreateTopic',
          },
        ]
      );
    } else {
      const report = reports[0];
      const responseText = fromReport(report);
      await context.sendText(responseText);
      await context.sendButtonTemplate(`你覺得這個結果正確嗎？`, [
        {
          type: 'postback',
          title: '正確',
          payload: 'CorrectResponseFeedback',
        },
        {
          type: 'postback',
          title: '錯誤',
          payload: 'IncorrectResponseFeedback',
        },
      ]);
    }
  } catch (err) {
    if (err instanceof UnsupportedMessageTypeError) {
      await context.sendText('很抱歉，我們暫時只支援文字及連結消息。');
    } else {
      console.error(err);
      await context.sendText(
        `事實查核小助手繁忙中，閣下可到 ${process.env.FACTCHECKLAB_CONTENT_URI} 查找有關的事實查證報告。`
      );
    }
  }
};
