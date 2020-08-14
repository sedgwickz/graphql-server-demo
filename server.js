"use strict";
// server.js
// where your node app starts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
var express_1 = __importDefault(require("express"));
var express_graphql_1 = require("express-graphql");
var graphql_1 = require("graphql");
var app = express_1.default();
var posts = [
    {
        id: 1,
        title: 'hello',
    },
    {
        id: 2,
        title: 'qweqwe',
    },
];
var schema = graphql_1.buildSchema("\n\ntype PageInfo {\n  endCursor: String\n  hasNext: Boolean\n}\n\ntype Post {\n  id: Int\n  title: String\n}\n\ntype Node {\n  node: Post\n}\n\ntype Result {\n  pageInfo: PageInfo\n  edges: [Node]\n  totalCount: Int\n}\n  type Query {\n    hello: String\n    items(first: Int = 10, after: String): Result\n  }\n");
var root = {
    hello: function () {
        return 'Hello world1111222!';
    },
    items: function (_a) {
        var first = _a.first, after = _a.after;
        var res = {
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
        };
        return res;
    },
};
app.use('/graphql', express_graphql_1.graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
var port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5000;
// listen for requests :)
var listener = app.listen(port, function () {
    console.log('Your app is listening on port ' + port);
});
