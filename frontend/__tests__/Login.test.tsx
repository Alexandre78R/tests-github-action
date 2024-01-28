import Login from "@/pages/auth/login";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { LOGIN } from "@/requetes/queries/auth.queries";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { MockedProvider } from "@apollo/client/testing";

jest.mock("next/router", () => ({
  ...jest.requireActual("next-router-mock"),
  push: jest.fn(),
}));

const mocks = [
  {
    request: {
      query: LOGIN,
      variables: {
        infos: { email: "test@mondomaine.com", password: "motdepasse" },
      },
    },
    result: {
      data: {
        login: {
          success: true,
          message: "Bienvenue!",
        },
      },
    },
  },
];

it("Snapshot du composant login", async () => {
  const { container, getByText, getByPlaceholderText  } = render(
    <MemoryRouterProvider url="/auth/login">
      <MockedProvider mocks={mocks} addTypename={false}>
        <Login />
      </MockedProvider>
    </MemoryRouterProvider>
  );

  // Remplissage du formulaire avec des données de test
  fireEvent.change(getByPlaceholderText("Indiquez votre email"), {
    target: { value: "test@mondomaine.com" },
  });
  fireEvent.change(getByPlaceholderText("Indiquez votre mot de passe"), {
    target: { value: "motdepasse" },
  });

  // Soumission du formulaire
  fireEvent.submit(getByText("Connexion"));

  // On attend un certain temps pour permettre à onCompleted de s'exécuter
  await waitFor(() => {}, { timeout: 1000 });

  // On vérifie le snapshot après que onCompleted a eu le temps de s'exécuter
  await waitFor(
    () => {
      expect(container).toMatchSnapshot();
    },
    { timeout: 10000 }
  );
});
