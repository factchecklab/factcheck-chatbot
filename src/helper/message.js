const { parse: parseURL } = require('url');

class UnsupportedMessageTypeError extends Error {}

// Parse the URL for Facebook fallback.
function parseFallbackURL(url) {
  const urlObject = parseURL(url, true);
  return urlObject.query.u;
}

// Parse content from the message context.
function parseContentFromCtx(ctx) {
  const { event } = ctx;
  if (event.isText) {
    return {
      data: event.text,
      forceCreate: false,
      cancelCreate: false,
    };
  } else if (event.isFallback) {
    // TODO (samueltangz): Support other platforms apart from Facebook.

    // Although documented in https://bottender.js.org/docs/en/api-messenger-event#fallback,
    // the behaviour is not as expected. In particular in Facebook:
    // {
    //   type: 'fallback',
    //   payload: {
    //     url: 'https://l.facebook.com/l.php?u=https%3A%2F%2Fgoogle.com%2F&h=AT3x....Ax3A&s=1',
    //     title: 'Google'
    //   }
    // }

    return {
      data: parseFallbackURL(event.fallback.payload.url),
      forceCreate: false,
      cancelCreate: false,
    };
  } else if (event.isPayload) {
    if (!ctx.state.report || !ctx.state.report.pendingCreate) {
      throw new UnsupportedMessageTypeError();
    }
    switch (event.payload) {
      default:
        throw new UnsupportedMessageTypeError();
      case 'CreateReport':
        return {
          data: ctx.state.report.data,
          forceCreate: true,
          cancelCreate: false,
        };
      case 'CancelCreateReport':
        return {
          data: ctx.state.report.data,
          forceCreate: false,
          cancelCreate: true,
        };
    }
  } else {
    throw new UnsupportedMessageTypeError();
  }
}

function headerFromConclusion(conclusion) {
  switch (conclusion) {
    default:
      return '這則消息的真確性尚未確定。';
    case 'truthy':
      return '這是一則真確無誤的消息。';
    case 'falsy':
      return '這是一則假消息。';
    case 'disputed':
      return '這是一則有爭議性的消息。';
  }
}

// Builds a response text from topic
function fromTopic(topic) {
  const { conclusion } = topic;
  const response = topic.responses[0].content;
  const header = headerFromConclusion(conclusion);
  return `${header}\n${response}`;
}

module.exports = {
  parseContentFromCtx,
  fromTopic,
  UnsupportedMessageTypeError,
};
