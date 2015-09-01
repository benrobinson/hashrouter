# hashrouter

A simple router to handle hash-based routes for front-end applications.

## Define your routes like:

With a separate, named handler function:
```
function view_collection(id) {
  console.log("The collection ID is: " + id);
}
HashRouter.route("collection/:id/view", view_collection);
```

With an anonymous function 
```
HashRouter.route("amount/:id/of/:pie", function(id, pie) {
  var response = "I would eat " + id + " " + pie;
  console.log(response);
});
```

## Using the callback to define what your route does

The callback you define takes any variable parameters you define in the URL as arguments, in the order that they appear in the structure. 

So a structure like:

`here/:there/is/:another/example`

Should have a callback that takes two arguments: 

```
function(there, another) { 
  console.log(there + " is " + another); 
}
```

And if you'd like your route handler to take query parameters, they are always available as the last argument (after any other parameters in the route):

```
function(there, another, query) { 
  console.log(there + " is " + another);
  console.log(query);
}
```

## This is a front end router

This is router is designed to handle changes after the hash (#).  

If you define a route like:

`HashRouter.route("structure/:dosomething/here", function(dosomething) { ... });`

The full URL to hit that route looks like:

`http://yourdomain.com/#/structure/something/here/`
