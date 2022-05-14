import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export default handleAuth({
	async login(req, res) {
		try {
			await handleLogin(req, res, {
				// set discord as default connection
				authorizationParams: {
					connection: "discord",
				},
			});
		} catch (error) {
			console.error(error);
			res.status(error.status || 500).end(error.message);
		}
	},
});
