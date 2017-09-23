# meetedgar-export

This is a [horseman](https://github.com/johntitus/node-horseman) script that
uses [phantomjs](http://phantomjs.org/) to export your data from [Edgar](http://meetedgar.com/)
social network management software.

I decided to take my data with me and use it elsewhere (I currently switched to
[recurpost](https://recurpost.com/) because their free program is enough for me,
but you can use the script to migrate to any other system).

## Installation

Make sure you have phantomjs installed and in path. Then install
horseman.

Since meetedgar references your content that can be loaded using http,
you need a small patch for horseman as well.

On macOS:

```bash
brew install phantomjs
cd meetedgar-export
npm install --save node-horseman
patch -p0 < horseman.patch
```

## Usage

```bash
DEBUG=horseman node meetedgar-export.js \
  'your@login.address' \
  'yourpassword' \
  'https://app.meetedgar.com/contents' \
  'output.json'
```

Instead of whole contents URL, you can also include a sub-url, like:
_https://app.meetedgar.com/contents?filter_by_account=12345_. You will get
the particular URL by clicking at your social media account and copying the
URL.

You will get the output in output.json if all goes well.

## Debugging

If it does not work (for example Edgar team changed something in HTML), please
debug it yourself. I no longer have an account with them and I do not have
time to debug it on your behalf. Pull requests are welcome.

## Exporting to recurpost

Recurpost uses simple format consisting of one post per line. This does not work
with image or image-only posts sadly.

I use a simple Ruby script for export. Syntax is simple, the first parameter
is the json file you got from meetedgar-export.js, the second parameter is
category name. I guess you want to export per category.

On macOS, this is how you put it to clipboard for direct pasting:

```bash
ruby export-recurpost.rb output.json "My Blog Posts" | pbcopy
```

You can of course just redirect it to a text file as well:

```bash
ruby export-recurpost.rb output.json "My Blog Posts" > my_blog_posts.txt
```

## Footer

This software is [public domain](LICENSE), please do whatever you want to do
with it, it comes with no warranty. If you found it useful, you can donate
Bitcoin to [3EC2JAR7Vs33vtqQqz3nxhwSMjPhb5hDDL](https://btc-bitcore3.trezor.io/address/3EC2JAR7Vs33vtqQqz3nxhwSMjPhb5hDDL) - click the link for QR code.

It saved me some money, so I hope it will save you some too.
