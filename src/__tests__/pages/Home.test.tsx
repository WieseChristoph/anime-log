import Home from "@/pages/[[...slug]]";
import { useSession } from "next-auth/react";
import { render, screen } from "@testing-library/react";

jest.mock("next-auth/react");
jest.mock("next/router", () => ({
    useRouter: jest.fn(() => ({ query: {} })),
}));
jest.mock("@/components/Log/Log", () => {
    const LogMock = () => <p>Log Component</p>;
    return LogMock;
});
jest.mock("@/components/Navbar/Navbar", () => {
    const NavbarMock = () => <div />;
    return NavbarMock;
});

describe("Home", () => {
    it("returns login alert if not logged in", () => {
        (useSession as jest.Mock).mockReturnValue({
            data: {},
            status: "unauthenticated",
        });

        render(<Home />);

        expect(screen.getByText("Must be logged in to access own log."));
    });

    it("returns log if logged in", () => {
        (useSession as jest.Mock).mockReturnValue({
            data: {},
            status: "authenticated",
        });

        render(<Home />);

        expect(screen.getByText("Log Component"));
    });
});
