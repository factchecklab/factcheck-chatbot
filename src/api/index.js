const fetch = require('node-fetch');
const { ApolloClient } = require('apollo-boost');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { createHttpLink } = require('apollo-link-http');
const dotenv = require('dotenv');
const gql = require('graphql-tag');

dotenv.config();

const client = new ApolloClient({
  link: createHttpLink({
    uri: process.env.MAAT_FCDB_GRAPHQL_ENDPOINT,
    fetch,
  }),
  cache: new InMemoryCache(),
});

async function similarTopics(content) {
  const { data } = await client.query({
    query: gql`
      query SimilarTopics($content: String) {
        similarTopics(content: $content) {
          id
          title
          createdAt
          updatedAt
          conclusion
          responses {
            content
            __typename
          }
          coverImage {
            url
            __typename
          }
          __typename
        }
      }
    `,
    variables: { content },
  });
  const similarTopics = data.similarTopics || [];
  return similarTopics;
}

async function createReport(content) {
  await client.mutate({
    mutation: gql`
      mutation createReport($input: CreateReportInput!) {
        createReport(input: $input) {
          report {
            id
          }
        }
      }
    `,
    variables: {
      input: {
        content,
        // TODO (samueltangz): change this source
        source: 'chatbot',
      },
    },
  });
}

module.exports = {
  similarTopics,
  createReport,
};
