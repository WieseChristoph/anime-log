import Link from "next/link";
import { FaDiscord } from "react-icons/fa";

const LoginButton = () => {
	return (
		<button className="bg-[#7289DA] rounded-md p-2">
			<Link href="/api/auth/login?connection=discord">
				<span className="flex items-center text-white">
					<FaDiscord className="mr-3 text-xl" />
					Login with Discord
				</span>
			</Link>
		</button>
	);
};

export default LoginButton;
