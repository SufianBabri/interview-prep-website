// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: "Interview Prep",
	tagline: "Prepare for interviews fast",
	url: "https://SufianBabri.github.io",
	baseUrl: "/interview-prep-website/",
	onBrokenLinks: "throw",
	onBrokenMarkdownLinks: "warn",
	favicon: "img/favicon.ico",

	// GitHub pages deployment config.
	organizationName: "SufianBabri",
	projectName: "interview-prep-website",
	trailingSlash: true,

	// Even if you don't use internalization, you can use this field to set useful
	// metadata like html lang. For example, if your site is Chinese, you may want
	// to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: "en",
		locales: ["en"]
	},
	themes: ["@docusaurus/theme-live-codeblock"],
	presets: [
		[
			"classic",
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					routeBasePath: "/",
					editUrl:
						"https://github.com/SufianBabri/interview-prep-website/tree/main/"
				},
				blog: false,
				theme: {
					customCss: require.resolve("./src/css/custom.css")
				}
			})
		]
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			navbar: {
				title: "Interview Prep",
				logo: {
					alt: "Interview Prep Logo",
					src: "img/logo.svg"
				},
				items: [
					{
						href: "https://github.com/SufianBabri/interview-prep-website",
						label: "GitHub",
						position: "right"
					}
				]
			},
			footer: {
				style: "dark",
				links: [],
				copyright: `Copyright © ${new Date().getFullYear()}. Built with Docusaurus.`
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme
			}
		})
};

module.exports = config;
