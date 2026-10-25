# Squarespace embed package

1. Edit `hosted-portfolio` using its local `editor.html`, download the updated `content.js`, and replace that file.
2. Upload the hosted-portfolio files to your own HTTPS hosting.
3. Open `make-embed.html` and generate iframe code using your hosted `embed.html` address.
4. Add a **Code block** to your Squarespace page, select HTML, disable Display Source, and paste the code.
5. Preview while logged out and check the published page on desktop and mobile. Adjust the frame height if needed.

Squarespace restricts iframe/JavaScript code blocks to supported plans. Its current documentation lists Core, Plus, Advanced, and some legacy plans; Basic does not support those iframe features. Check your actual account before choosing this package. A normal link to the hosted portfolio is an alternative on plans without iframe support.

This is a hosted HTML embed, not a native Squarespace extension, template installation, or CMS import.

Official instructions: https://support.squarespace.com/hc/en-us/articles/206543167-Add-custom-code-to-a-page-with-code-blocks

Browser rendering and the generated iframe are tested locally. No live Squarespace account or paid plan was used to verify publication in this release.
