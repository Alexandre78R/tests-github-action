import assert from "assert";
import Book from "../src/entities/book.entity";
import BookResolver from "../src/resolvers/book.resolver";
import { addMocksToSchema } from "@graphql-tools/mock";
import { ApolloServer } from "@apollo/server";
import { buildSchemaSync } from "type-graphql";

export const LIST_BOOKS = `#graphql
    query Books {
        books {
            title
            id
        }
    }
`;
export const LIST_BOOKS_WITH_ID = `#graphql
    query Books {
        books {        
            id
        }
    }
`;

export const FIND_BOOK_BY_ID = `#graphql
    query FindBook($findBookId: String!) {
        findBook(id: $findBookId) {
            id
            title
        }
    }
`;
export const TEST = `#graphql
    query Test {
        test
    }
`;

type ResponseData = {
  books: Book[];
};
type ResponseOneBookData = {
  findBook: Book;
};

const booksData: Book[] = [
  { id: "1", title: "Mon Livre 1" },
  { id: "2", title: "Mon Livre 2" },
];

let server: ApolloServer;

const baseSchema = buildSchemaSync({
  resolvers: [BookResolver],
  authChecker: () => true,
});

beforeAll(async () => {
  const mocks = {
    Int: () => 4,
    Float: () => 5.2,
    Boolean: () => true,
  };

  const resolvers = () => ({
    Query: {
      books() {
        return booksData;
      },
      findBook(_: any, args: { id: string }) {
        return booksData.find((b) => b.id == args.id);
      },
    },
  });

  server = new ApolloServer({
    schema: addMocksToSchema({
      schema: baseSchema,
      mocks,
      resolvers: resolvers as unknown as ReturnType<typeof resolvers> &
        typeof mocks,
    }),
  });
});

describe("Test sur les livres", () => {
  it("mon premier test", async () => {
    const response = await server.executeOperation<ResponseData>({
      query: LIST_BOOKS,
    });

    assert(response.body.kind === "single");
    expect(response.body.singleResult.data).toEqual({
      books: booksData,
    });
  });

  it("récupération des livres uniquement avec leurs identifiants", async () => {
    const response = await server.executeOperation<ResponseData>({
      query: LIST_BOOKS_WITH_ID,
    });

    assert(response.body.kind === "single");
    expect(response.body.singleResult.data).toEqual({
      books: booksData.map((b) => ({ id: b.id })),
    });
  });

  it("récupération d'un livre à partir de son identifiant", async () => {
    const response = await server.executeOperation<ResponseOneBookData>({
      query: FIND_BOOK_BY_ID,
      variables: {
        findBookId: "1",
      },
    });
    assert(response.body.kind === "single");
    expect(response.body.singleResult.data).toEqual({
      findBook: booksData[0],
    });
  });

  it("test number", async () => {
    const response = await server.executeOperation<ResponseOneBookData>({
      query: TEST,
    });
    assert(response.body.kind === "single");
    expect(response.body.singleResult.data).toEqual({
      test: 4,
    });
  });
});
