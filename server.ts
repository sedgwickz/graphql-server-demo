import fs from 'fs'
import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import cors from 'cors'
const app = express()

const posts: [Post] = JSON.parse(fs.readFileSync('./data.json', 'utf-8'))

interface PageInfo {
  endCursor: string
  hasNext: Boolean
}

interface Post {
  quote: string
  author: string
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
  id: String
  quote: String
  author: String
}

type Node {
  node: Post
}

type Result {
  pageInfo: PageInfo
  edges: [Node]
  totalCount: Int
  nodes: [Post]
}
  type Query {
    hello: String
    items(first: Int = 10, after: String): Result
  }
`)

const root = {
  hello: () => {
    return 'Hello world1111222!'
  },
  items: ({ first, after }: { first: number; after: string }) => {
    const startIndex = after
      ? Number(Buffer.from(after, 'base64').toString().split(':').pop()) + 1
      : 0
    const selectPosts = posts.slice(startIndex, startIndex + first)
    const endCursor = Buffer.from(
      `cursor:${startIndex * first + selectPosts.length - 1}`,
    ).toString('base64')
    const res = {
      totalCount: posts.length,
      pageInfo: { endCursor: endCursor, hasNext: selectPosts.length === first },
      edges: selectPosts.map((p: Post, index: number) => {
        return {
          node: {
            id: Buffer.from(`cursor:${index}`).toString('base64'),
            ...p,
          },
        }
      }),
      nodes: selectPosts.map((p: Post, index: number) => {
        return { ...p, id: Buffer.from(`cursor:${index}`).toString('base64') }
      }),
    }

    return res
  },
}

app.use(cors())
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
