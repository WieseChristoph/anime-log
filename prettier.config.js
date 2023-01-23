/** @type {import("prettier").Config} */

module.exports = {
	plugins: [require.resolve("prettier-plugin-tailwindcss")],
	tabWidth: 4,
	semi: true,
	bracketSpacing: true,
};
