# Webflow embed package

1. Unzip the package. Open `hosted-portfolio/editor.html` locally, edit your projects, and download/replace `content.js`.
2. Upload the contents of `hosted-portfolio` to your own HTTPS hosting, such as a new cPanel `/portfolio/` folder.
3. Open `make-embed.html` locally. Enter the public HTTPS address of `embed.html` and generate the iframe code.
4. In Webflow, add a **Code Embed** element, paste the generated code, save, and publish.
5. Check the published page at desktop and mobile sizes; adjust the iframe height when needed.

Webflow requires access to its Code Embed feature through an eligible Workspace or Site plan. This is a hosted HTML embed, not a native Webflow application or a Webflow CMS import. The portfolio is edited in the included local editor, then updated on its hosting.

Official instructions: https://help.webflow.com/hc/en-us/articles/33961332238611-Custom-code-embed

Browser rendering and the generated iframe are tested locally. No live Webflow account or paid plan was used to verify publication in this release.
