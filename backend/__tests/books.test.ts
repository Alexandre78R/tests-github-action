import { buildSchemaSync } from "type-graphql";
import BookResolver from "../src/resolvers/book.resolver";
import { ApolloServer } from "@apollo/server";
import Book from "../src/entities/book.entity";
import { addMocksToSchema } from "@graphql-tools/mock";

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

type ResponseData = {
  books: Book[];
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
    Query: {
      books() {
        return booksData;
      },
    },
  };

  server = new ApolloServer({
    schema: addMocksToSchema({ schema: baseSchema, mocks }),
  });
});

describe("Test sur les livres", () => {
  it("mon premier test", async () => {
    const response = await server.executeOperation<ResponseData>({
      query: LIST_BOOKS,
    });

    if (response.body.kind === "single" && response.body.singleResult.data) {
      expect(response.body.singleResult.data).toEqual({
        books: booksData,
      });
    }
  });

  it("récupération des livres uniquement avec leurs identifiants", async () => {
    const response = await server.executeOperation<ResponseData>({
      query: LIST_BOOKS_WITH_ID,
    });

    if (response.body.kind === "single" && response.body.singleResult.data) {
      expect(response.body.singleResult.data).toEqual({
        books: booksData.map((b) => ({ id: b.id })),
      });
    }
  });
});
