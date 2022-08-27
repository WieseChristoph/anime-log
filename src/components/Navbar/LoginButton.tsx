import { signIn } from "next-auth/react";
import { FaDiscord } from "react-icons/fa";

const LoginButton = () => {
	return (
		<button
			className="bg-[#7289DA] rounded-md p-2"
			onClick={() => signIn("discord")}
		>
			<span className="flex items-center text-white">
				<FaDiscord className="mr-3 text-xl" />
				Login with Discord
			</span>
		</button>
	);
};

export default LoginButton;
