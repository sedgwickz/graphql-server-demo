"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var express_1 = __importDefault(require("express"));
var express_graphql_1 = require("express-graphql");
var graphql_1 = require("graphql");
var cors_1 = __importDefault(require("cors"));
var app = express_1.default();
var posts = JSON.parse(fs_1.default.readFileSync('./data.json', 'utf-8'));
var schema = graphql_1.buildSchema("\n\ntype PageInfo {\n  endCursor: String\n  hasNext: Boolean\n}\n\ntype Post {\n  id: String\n  quote: String\n  author: String\n}\n\ntype Node {\n  node: Post\n}\n\ntype Result {\n  pageInfo: PageInfo\n  edges: [Node]\n  totalCount: Int\n  nodes: [Post]\n}\n  type Query {\n    hello: String\n    items(first: Int = 10, after: String): Result\n  }\n");
var root = {
    hello: function () {
        return 'Hello world1111222!';
    },
    items: function (_a) {
        var first = _a.first, after = _a.after;
        var startIndex = after
            ? Number(Buffer.from(after, 'base64').toString().split(':').pop()) + 1
            : 0;
        var selectPosts = posts.slice(startIndex, startIndex + first);
        var endCursor = Buffer.from("cursor:" + (startIndex * first + selectPosts.length - 1)).toString('base64');
        var res = {
            totalCount: posts.length,
            pageInfo: { endCursor: endCursor, hasNext: selectPosts.length === first },
            edges: selectPosts.map(function (p, index) {
                return {
                    node: __assign({ id: Buffer.from("cursor:" + index).toString('base64') }, p),
                };
            }),
            nodes: selectPosts.map(function (p, index) {
                return __assign(__assign({}, p), { id: Buffer.from("cursor:" + index).toString('base64') });
            }),
        };
        return res;
    },
};
app.use(cors_1.default());
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
