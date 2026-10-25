# Your downloadable portfolio website

This is a working HTML/CSS/JavaScript website. It needs no WordPress, PHP, database, account, or build command. JavaScript must be enabled in the visitor's browser.

## Edit it on your computer

1. Unzip the package and open `editor.html` in a current browser.
2. Add or edit your projects, implementations, evidence, architecture, and results.
3. Choose **Preview changes**, then **Download content.js**.
4. Replace `content.js` in this folder with the downloaded file. Keep its filename exactly `content.js`.
5. Open `index.html` to check the result. **Export JSON backup** keeps a separate editable content backup.

The editor does not automatically save to your hosting. Changes that have not been downloaded are lost when the page closes. You can keep the editor only on your computer; it is not a protected online admin area and does not provide server login or authentication.

## Publish on cPanel or ordinary hosting

1. In cPanel File Manager, create a new folder such as `public_html/portfolio`. Use a new folder so the existing website is not overwritten.
2. Upload and extract the website ZIP there. `index.html`, `content.js`, and the `assets` folder must sit directly inside that folder.
3. Visit `https://YOUR-DOMAIN/portfolio/` and check the projects.
4. To update it later, edit locally, download `content.js`, and upload the replacement file. Upload any new media files too.

The same files work on standard static hosting or any server that serves HTML/CSS/JavaScript. No claim is made about your host's particular configuration. Keep a copy before replacing files.

## Images and evidence

Use HTTPS image/link addresses or local paths such as `media/screenshot.png`. Put the corresponding files in that folder before upload. A JSON backup does not contain media files. The supplied examples and their diagram are fictional; replace them with your own approved public work.

## Embedding

`embed.html` displays the portfolio without the surrounding site header/footer. An embed package includes a small code generator and instructions for the chosen platform. The portfolio must be hosted at an HTTPS address that permits framing. It is not installed as a native Wix/Webflow/Squarespace app and does not write to their CMS.

## License and limits

The website/editor source is MIT licensed; retain the included license notice when redistributing software copies. Your own project content remains yours. There is no telemetry, required email signup, contact-processing backend, automatic hosting write, or payment system. This first release renders project content in the browser; search-engine behavior and platform account compatibility are not certified.
