import assert from 'assert';
import Book from '../src/entities/book.entity';
import BookResolver from '../src/resolvers/book.resolver';
import datasource from '../src/lib/datasource_test';
import datasourceInitial from '../src/lib/datasource';
import { ApolloServer } from '@apollo/server';
import { buildSchemaSync } from 'type-graphql';
import { isUuid } from 'uuidv4';
//backend/__tests/books-db.test.ts
 //on importe la datasource de test
 //on importe la datasource initial pour le spyOn

let server: ApolloServer;

export const LIST_BOOKS = `#graphql
    query Books {
        books {
            title
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

type ResponseData = {
  books: Book[];
};

type ResponseDataCreate = {
  createBook: Book;
};

const baseSchema = buildSchemaSync({
  resolvers: [BookResolver],
  authChecker: () => true,
});

beforeAll(async () => {
  server = new ApolloServer({
    schema: baseSchema,
  });

  jest
    .spyOn(datasourceInitial, "getRepository")
    .mockReturnValue(datasource.getRepository(Book));

  await datasource.initialize(); //initialisation de la datasource
  await datasource.getRepository(Book).clear(); //vidage de la table des livres avant tous les tests
});
afterAll(async () => {
  await datasource.dropDatabase(); //vidage de la datasource
});

describe("Test sur les livres avec la base de données", () => {
  it("récupération de la liste des livres en base", async () => {
    const response = await server.executeOperation<ResponseData>({
      query: LIST_BOOKS,
    });
    assert(response.body.kind === "single");
    expect(response.body.singleResult.data?.books).toHaveLength(0);
  });

  it("Création d'un livre et stockage dans le store", async () => {
    const response = await server.executeOperation<ResponseDataCreate>({
      query: CREATE_BOOK,
      variables: {
        infos: {
          title: "Mon Livre 1",
        },
      },
    });
    assert(response.body.kind === "single");
    const id = response.body.singleResult.data?.createBook.id;
    expect(id).not.toBeNull();
    expect(isUuid(`${id}`)).toBeTruthy();
    expect(response.body.singleResult.data?.createBook.title).toEqual(
      "Mon Livre 1"
    );
  });

  it("récupération de la liste des livres en base après l'ajout d'un livre", async () => {
    const response = await server.executeOperation<ResponseData>({
      query: LIST_BOOKS,
    });
    assert(response.body.kind === "single");
    expect(response.body.singleResult.data?.books).toHaveLength(1);
  });
});
