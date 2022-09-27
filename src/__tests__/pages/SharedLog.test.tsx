import Home from "@/pages/[[...slug]]";
import { useSession } from "next-auth/react";
import { render, screen } from "@testing-library/react";

jest.mock("next-auth/react");
jest.mock("next/router", () => ({
    useRouter: jest.fn(() => ({ query: { slug: ["test"] } })),
}));
jest.mock("@/components/Log/Log", () => {
    const LogMock = ({ shareId }: { shareId: string }) => <p>{shareId}</p>;
    return LogMock;
});
jest.mock("@/components/Navbar/Navbar", () => {
    const NavbarMock = () => <div />;
    return NavbarMock;
});

describe("SharedLog", () => {
    it("returns log with shareId", () => {
        (useSession as jest.Mock).mockReturnValue({
            data: {},
            status: "authenticated",
        });

        render(<Home />);

        expect(screen.getByText("test"));
    });
});
