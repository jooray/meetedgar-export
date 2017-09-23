var Horseman = require("node-horseman");
var fs = require('fs');

var horseman = new Horseman({timeout: 30000, loadImages: false});

var email = process.argv[2];
var password = process.argv[3];
var scrape_url = process.argv[4];
var output_file = process.argv[5];

var library = [];

function getLibrary(){
	return horseman.evaluate( function(){
		// This code is executed in the browser.
    console.log('Evaluating in browser...');
		var library = [];
		$("div.content-item__container").each(function( index ){
      var text_element = $(this).find('div.content-item__link-text');
      var img = false;
      if (!text_element.text()) {
        text_element = $(this).find('div.content-item__link-text--skinny');
        img = $(this).find('img.content-item__link-thumb-image').attr('src');
      }
			var content = {
				content_html : text_element.html(),
        content_text : text_element.text(),
        content_thumbnail : img,
				category_id : $(this).next().next().find('div.content-item__category > a').attr("href"),
        category_name : $(this).next().next().find('div.content-item__category > a').text(),
			};
			library.push(content);
      console.log('Element start');
      console.log(JSON.stringify(content, null, 2));
      console.log('Element end');
		});
    console.log('Done evaluating in browser...');
		return library;
	});
}

function hasNextPage(){
	return horseman.exists('a[rel="next"]');
}

function scrape(){

	return new Promise( function( resolve, reject ){
		return getLibrary()
		.then(function(newContent){

			library = library.concat(newContent);

      console.log('Handled a page, continuing...');

			return hasNextPage()
				.then(function(hasNext){
					if (hasNext){
						return horseman
							.click('a[rel="next"]')
							.waitForNextPage()
							.then( scrape );
					}
				});
		})
		.then( resolve );
	});
}

horseman
	.userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0")
  .on('error', (msg, trace) => {
    console.log('PHANTOM error');
    console.log(msg);
    console.log(trace);
  })
  .on('consoleMessage', function( msg ){
    console.log('JS Console:')
    console.log(msg);
  })
	.open("https://app.meetedgar.com/users/sign_in")
	.type("input[id='user_email']", email)
  .type("input[id='user_password']", password)
	.click("input[value='Sign In']")
  .waitForNextPage()
  .open(scrape_url)
  .waitForNextPage()
	.then( scrape )
	.finally(function(){
    fs.writeFile(output_file, JSON.stringify(library, null, 2),function(err){
      if(err) throw err;
      console.log("Saved output to " + output_file);
    })
		horseman.close();
	})
  .catch( (err) => {
    console.log(err)
  });
