import assert from "assert";
import Book, { InputCreateBook } from "../src/entities/book.entity";
import BookResolver from "../src/resolvers/book.resolver";
import {
  IMockStore,
  Ref,
  addMocksToSchema,
  createMockStore,
} from "@graphql-tools/mock";
import { ApolloServer } from "@apollo/server";
import { buildSchemaSync } from "type-graphql";
import { printSchema } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";

export const LIST_BOOKS = `#graphql
    query Books {
        books {
            id
        }
    }
`;

export const CREATE_BOOK = `#graphql
    mutation CreateBook($infos: InputCreateBook!) {
        createBook(infos: $infos) {
            id
            title
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

type ResponseData = {
  books: Book[];
};

type ResponseDataCreate = {
  createBook: Book;
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

const schemaString = printSchema(baseSchema);
const schema = makeExecutableSchema({ typeDefs: schemaString });

beforeAll(async () => {
  const store = createMockStore({ schema });
  const resolvers = (store: IMockStore) => ({
    Query: {
      books() {
        return store.get("Query", "ROOT", "books");
      },
      findBook(_: null, { id }: { id: string }) {
        return store.get("Book", id);
      },
    },
    Mutation: {
      createBook: (_: null, { infos }: { infos: InputCreateBook }) => {
        store.set("Book", "3", infos);
        return store.get("Book", "3");
      },
    },
  });
  server = new ApolloServer({
    schema: addMocksToSchema({
      schema: baseSchema,
      store,
      resolvers,
    }),
  });

  //remplissage du store
  store.set("Query", "ROOT", "books", booksData);
});

describe("Test sur les livres", () => {
  it("Récupération des livres depuis le store", async () => {
    const response = await server.executeOperation<ResponseData>({
      query: LIST_BOOKS,
    });

    assert(response.body.kind === "single");
    expect(response.body.singleResult.data).toEqual({
      books: [{ id: "1" }, { id: "2" }],
    });
  });

  it("Création d'un livre et stockage dans le store", async () => {
    const response = await server.executeOperation<ResponseDataCreate>({
      query: CREATE_BOOK,
      variables: {
        infos: {
          title: "Mon Livre 3",
        },
      },
    });
    assert(response.body.kind === "single");
    expect(response.body.singleResult.data).toEqual({
      createBook: {
        id: "3",
        title: "Mon Livre 3",
      },
    });
  });

  it("Récupération d'un livre depuis le store après l'ajout d'un troisième", async () => {
    const response = await server.executeOperation<ResponseData>({
      query: FIND_BOOK_BY_ID,
      variables: {
        findBookId: "3",
      },
    });

    assert(response.body.kind === "single");
    expect(response.body.singleResult.data).toEqual({
      findBook: {
        id: "3",
        title: "Mon Livre 3",
      },
    });
  });
});
