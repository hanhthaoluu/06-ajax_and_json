'use strict';

function Article (rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// REVIEW: Instead of a global `articles = []` array, let's track this list of all articles directly on the
// constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves
// objects, which means we can add properties/values to them at any time. In this case, we have
// a key/value pair to track, that relates to ALL of the Article objects, so it does not belong on
// the prototype, as that would only be relevant to a single instantiated Article.
///////can add properties to function; on constructor function itself;
///////adding the property all to article constructor function
////////this array is not going to be added to each new article instance; it's only on the constructor function itself
///////this array can only accessed with Article.all
Article.all = [];


Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEW: There are some other functions that also relate to articles across the board, rather than
// just single instances. Object-oriented programming would call these "class-level" functions,
// that are relevant to the entire "class" of objects that are Articles.

// REVIEW: This function will take the rawData, however it is provided,
// and use it to instantiate all the articles. This code is moved from elsewhere, and
// encapsulated in a simply-named function for clarity.
/////loadAll absorb all rawdata
////////class method/constructor method;
/////only called on capital Article, not a prototype
/////////////rawData is the parameter
////////constructor method Article.loadAll
Article.loadAll = function(rawData) {
  rawData.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

  rawData.forEach(function(ele) {
    Article.all.push(new Article(ele));
  })
}

// This function will retrieve the data from either a local or remote source,
// and process it, then hand off control to the View.
Article.fetchAll = function() {
  // TODO: When we don't already have the rawData,
  // we need to retrieve the JSON file from the server with AJAX (which jQuery method is best for this?),
  // cache it in localStorage so we can skip the server call next time,
  if (!localStorage.rawData) {
    ///////$.getJSON(url[, data][,success]) load JSON-encoded data from the server using a GET HTTP request
    ////////////url is a string containing the URL to which the request is sent
    ////////////success; type function is a callback function that is executed if the request succeeds
    $.getJSON('./data/hackerIpsum.json', function(data) {
      localStorage.setItem('rawData', JSON.stringify(data));
      ///////storage.setItem(keyName, keyValue);
      ///////setItem is a method to put rawdata into localStorage;
      ///////setItem() method of the storage interface, when passed a key name and value, will add that key to the storage, or update that key's value if it already exists.
      ///////JSON.stringify()  converts a js object into a string, formatted using JSON. this allows you to send JS objects from the browser to another application
    });
  }
// When rawData is already in localStorage,
// we can load it with the .loadAll function above,

  Article.loadAll(JSON.parse(localStorage.rawData));
  ////JSON.parse() processes a string containing JSON data; converts the JSON data into a JS objects ready for the browser to use
  articleView.initIndexPage();
  // and then render the index page (using the proper method on the articleView object).
}
// if localStorage rawdata exist then use localStorage rawdata
// rawdata is stored in hackeripsum.json
// if hackeripsum is not in localStorage already then do so
