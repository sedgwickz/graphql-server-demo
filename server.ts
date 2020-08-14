// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
const app = express()

const posts = [
  {
    id: 1,
    title: 'hello',
  },
  {
    id: 2,
    title: 'qweqwe',
  },
]

interface PageInfo {
  endCursor: String
  hasNext: Boolean
}

interface Post {
  id: number
  title: String
}

interface Node {
  node: Post
}

interface Result {
  pageInfo: PageInfo
  edges: [Node]
  totalCount: number
}

const schema = buildSchema(`

type PageInfo {
  endCursor: String
  hasNext: Boolean
}

type Post {
  id: Int
  title: String
}

type Node {
  node: Post
}

type Result {
  pageInfo: PageInfo
  edges: [Node]
  totalCount: Int
}
  type Query {
    hello: String
    items(first: Int = 10, after: String): Result
  }
`)

interface InputParams {
  first: number
  after: string
}

const root = {
  hello: () => {
    return 'Hello world1111222!'
  },
  items: ({ first, after }: InputParams) => {
    const res = {
      pageInfo: {
        endCursor: '111',
        hasNext: true,
      },
      edges: [
        {
          node: {
            id: 1,
            title: 'hello',
          },
        },
      ],
      totalCount: 111,
    }
    return res
  },
}

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }),
)

const port = process.env.PORT ?? 5000

// listen for requests :)
const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + port)
})
