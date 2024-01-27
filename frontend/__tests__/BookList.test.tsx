import ListBooks from "@/pages/books/list";
import { Book } from "@/types/graphql";
import { LIST_BOOKS } from "@/requetes/queries/books.queries";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

const mocks: MockedResponse<{ books: Book[] }>[] = [
  {
    request: {
      query: LIST_BOOKS,
    },
    result: {
      data: {
        books: [
          { id: "1", title: "Mon titre 1" },
          { id: "2", title: "Mon titre 2" },
        ],
      },
    },
  },
];

afterEach(() => {
  jest.resetAllMocks();
});

describe("Liste des livres", () => {
  it("récupération de liste et affichage des éléments", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ListBooks />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Mon titre 1")).toBeInTheDocument();
    });
  });
});
