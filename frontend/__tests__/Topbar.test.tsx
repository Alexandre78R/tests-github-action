import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Topbar from "../src/components/layout-elements/Topbar";
const reactModule = jest.requireActual("react");

afterEach(() => {
  jest.resetAllMocks();
});

describe("Topbar", () => {
  it("rendu du titre dans la topbar", () => {
    render(<Topbar />);
    const titre = screen.getByText("Quête JWT");
    expect(titre).toBeInTheDocument();
  });

  it("mock d'un faux utilisateur connecté", () => {
    const useStateSpy = jest.spyOn(reactModule, "useState");
    useStateSpy.mockReturnValue([
      { email: "test@mondomaine.com", role: "ADMIN" },
      jest.fn(),
    ]);

    render(<Topbar />);

    const titre = screen.getByText("Quête JWT test@mondomaine.com");

    expect(titre).toBeInTheDocument();
  });

  it("mock d'un faux utilisateur connecté et vérification de l'apparition du bouton", () => {
    const useStateSpy = jest.spyOn(reactModule, "useState");
    useStateSpy.mockReturnValue([
      { email: "test@mondomaine.com", role: "ADMIN" },
      jest.fn(),
    ]);

    render(<Topbar />);

    const adminLink = screen.getByTestId("admin-link");

    expect(adminLink).toBeInTheDocument();
  });
});
