const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb'),
  q = faunadb.query;
const shortid = require('shortid');

const typeDefs = gql`
  type Query {
    getVCard: [vCard]
  }
  type vCard {
    id: ID!
    c1: String!
    c2: String!
    c3: String!
    rec: String!
    sender: String!
    msg: String!
    link: String!
  }
  type Mutation {
    addVCard(c1: String!, 
      c2: String!,
      c3: String!,
      rec: String!,
      sender: String!,
      msg: String!) : vCard
  }
`

const resolvers = {
  Query: {
    getVCard: (root, args, context) => {
      return [{}]
    }
  },
  Mutation: {
    addVCard: async (_, { c1, c2, c3, rec, msg, sender }) => {
      var adminClient = new faunadb.Client({
        secret: "fnAEUcOFSLAAQ8VAgf02SRa7uDSxHvszaA8COAEn",
        domain: 'db.us.fauna.com',
        scheme: 'https',
      });

      console.log(c1, c2, c3, rec, msg, sender)
      const result = await adminClient.query(
        q.Create(
          q.Collection('lolly'),
          {
            data: {
              c1, c2, c3, rec, msg, sender,
              link: shortid.generate()
            }
          },
        )
      )
      return result.data.data
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
