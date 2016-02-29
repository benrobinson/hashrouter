/* ============================================
 *
 * HashRouter
 * ----------
 * A class for front end routing
 *
** ============================================ */

/*
 * @function HashRouter
 * @constructor
**/
function HashRouter () {

  'use strict';

  // Routes -- none until defined
  this.routes = {};

  // Initialize lastPath
  this.lastPath = "";

  // Set up event hooks
  this.registerEvents();
} 

/*
 * @method route
 * @params {string} pattern, like "item/:id"
 * @params {function} callback
**/
HashRouter.prototype.route = function(pattern, callback) {

  // Find Params
  var idParams = /:[a-zA-Z0-9]+/g;
  var params = pattern.match(idParams);

  // Construct the key from the route string
  var replaceParams = "([^\/]+)";
  var pattern = pattern.replace(idParams, replaceParams);
  pattern = pattern.replace(/\//g, "\\\/");
  pattern = "^\#\!\/" + pattern + "\/?$";

  // Add this route to the routes
  this.routes[pattern] = callback;

  // Alert the page that a route has loaded.
  this.notify();
};

/*
 * @method view -- visit an established route
 * @params {string} route
**/
HashRouter.prototype.view = function(route) {

  // If a route was passed, push the route to the browser
  if (route && route != "") {
    window.history.pushState({route: route}, route, route);
  }

  // Retrieve a path object
  var path = this.getPath();

  // Retrieve a query object if a querystring is present
  if (path.querystring) {        
    var query = this.getQuery(path.querystring);
  }

  // Work with the provided route
  if (path.route) {

    var route = this.getRoute(path.route);

    if ( route ) {

      // Append the query as the last param if present
      if ( query ) {
        route.args[route.args.length] = query;
      }

      // Make sure we're not already on this route
      if (path.string != this.lastPath) {

        // Record this as the last path
        this.lastPath = path.string;

        // Follow the route
        this.followRoute(route);
      }
    }
  }
};

/*
 * @method getRoute
 * @params {string} possible
 * @returns {object} route
**/
HashRouter.prototype.getRoute = function(possible) {

  var pattern, match;

  // Check for a match based on the route's regex hash
  for ( var route in this.routes ) {
    pattern = new RegExp(route);
    match = pattern.exec(possible);
    if (match && match.length) {
      match = match.slice(1, match.length);
      return {action: this.routes[route], args: match};
    }
  }
  return false;
};

/*
 * @method followRoute -- fires the route's callback function with provided args
 * @params {string} route
**/
HashRouter.prototype.followRoute = function(route) {
  route.action.apply(this, route.args);
  this.notify(route);
};

/*
 * @method getPath -- gets the current browser location and splits into a hash and a query
 * @returns {object} path
**/
HashRouter.prototype.getPath = function() {
  var full = window.location.hash;
  var piece = full.split("?");
  var route = piece[0];
  if (piece.length > 1) {
    var querystring = piece[1]; 
  }
  return {route: route, querystring: querystring, string: window.location.hash};
};

/*
 * @method getQuery -- breaks down the query params into an object
 * @params {string} querystring
 * @returns {object} query or {boolean} false
**/
HashRouter.prototype.getQuery = function(querystring) {
  if (querystring) {
    var pairs = querystring.split("&");
    var params = {};
    for (i=0; i<pairs.length; ++i) {
      var keyval = pairs[i].split("=");
      params[keyval[0]] = keyval[1];
    }
    return params;
  } else {
    return false;
  }
};

/*
 * @method notify -- fire a "hashrouter:update" event
 * @params {object} route
**/
HashRouter.prototype.notify = function(route) {
  if (route) {
    var hashRouterUpdate = new CustomEvent("hashrouter:update", {detail: route});
    window.dispatchEvent(hashRouterUpdate);
  } else {
    var hashRouterLoaded = new CustomEvent("hashrouter:loaded");
    window.dispatchEvent(hashRouterLoaded);
  }
};

/*
 * @method registerEvents -- listen for change events
**/
HashRouter.prototype.registerEvents = function() {

  var self = this;

  window.addEventListener("hashrouter:loaded", function() {
    self.view();
  });

  window.addEventListener("hashchange", function() {
    self.view();
  });
}
