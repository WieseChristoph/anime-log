import { signIn } from "next-auth/react";
import { FaDiscord } from "react-icons/fa";

function LoginButton() {
    return (
        <button
            className="rounded-md bg-[#7289DA] py-1 px-2"
            onClick={() => signIn("discord")}
        >
            <span className="flex items-center text-white">
                <FaDiscord className="mr-3 text-xl" />
                Login with Discord
            </span>
        </button>
    );
}

export default LoginButton;
