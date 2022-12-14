# Import bootstrap

In this demo we will install and configure parcel to import the well known [Bootstrap](https://getbootstrap.com/) CSS library.

We start from sample _03 SASS_.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min v8.9) if they are not already installed on your computer.

> Verify that you are running at least node v8.x.x and npm 5.x.x by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from _03 SASS_. Just copy the project and execute _npm install_

```cmd
npm install
```

- Let's install bootstrap

```bash
npm install bootstrap --save
```

- Let's update our HTML to include a link to bootstrap.

_./srsc/index.html_

```diff
<html>
+ <head>
+     <link rel="stylesheet" href="../node_modules/bootstrap/dist/css/bootstrap.css">
+ </head>
<body>
  <h1>Check the console log</h1>
```

- Let's modify our _index.html_ and include some specific bootstrap component.

```diff
...
<body>
  <h1>Check the console log</h1>
+  <div class="card" style="width: 18rem">
+    <div class="card-body">
+      <h5 class="card-title">Card title</h5>
+      <p class="card-text">
+        Some quick example text to build on the card title and make up the
+        bulk of the card's content.
+      </p>
+      <a href="#" class="btn btn-primary">Go somewhere</a>
+    </div>
+  </div>
  <div class="red-background">
      RedBackground stuff
  </div>
  <script type="module" src="./index.js"></script>
</body>
</html>
```

- Let's start the project and verify Bootstrap styles work properly.

```
npm start
```
