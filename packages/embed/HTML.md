# Generic HTML embed package

Edit `hosted-portfolio/editor.html`, download/replace `content.js`, and upload that folder's contents to an HTTPS address under your control. Use the included `make-embed.html` to create an iframe pointing at the hosted `embed.html`. Paste the code into the HTML of your existing website.

Set an appropriate width and height in your website's layout. The host must permit framing, and the parent site must permit the hosted address in its iframe policy. There is no automatic cross-origin height adjustment. The portfolio remains independently hosted and edited; this does not write to another platform's CMS.

This method can also work in other website builders that support third-party HTTPS iframe embeds. Their account/plan restrictions must be checked separately; universal compatibility is not claimed.
