const fetch = require('node-fetch');
const { ApolloClient } = require('apollo-boost');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { createHttpLink } = require('apollo-link-http');
const dotenv = require('dotenv');
const gql = require('graphql-tag');

dotenv.config();

const client = {
  editorial: new ApolloClient({
    link: createHttpLink({
      uri: process.env.FACTCHECKLAB_EDITORIAL_GRAPHQL_ENDPOINT,
      fetch,
    }),
    cache: new InMemoryCache(),
  }),
  facts: new ApolloClient({
    link: createHttpLink({
      uri: process.env.FACTCHECKLAB_FACTS_GRAPHQL_ENDPOINT,
      fetch,
    }),
    cache: new InMemoryCache(),
  }),
};

async function searchRelatedReports(originalMessage, originalUrl) {
  const { data } = await client.facts.query({
    query: gql`
      query SearchRelatedReports($originalMessage: String, $originalUrl: URL) {
        searchRelatedReports(
          originalMessage: $originalMessage
          originalUrl: $originalUrl
        ) {
          nodes {
            summary
            conclusion
            fullReportUrl
          }
        }
      }
    `,
    variables: { originalMessage, originalUrl },
  });
  const { searchRelatedReports = {} } = data;
  const { nodes = [] } = searchRelatedReports;
  return nodes;
}

async function submitTopic(message, url) {
  await client.editorial.mutate({
    mutation: gql`
      mutation submitTopic($input: SubmitTopicInput!) {
        submitTopic(input: $input) {
          submittedTopic {
            id
          }
        }
      }
    `,
    variables: {
      input: {
        message,
        url,
      },
    },
  });
}

module.exports = {
  searchRelatedReports,
  submitTopic,
};
