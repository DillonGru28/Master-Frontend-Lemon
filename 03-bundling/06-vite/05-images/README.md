# Handling images

It's time to handle static assets like images or fonts, as we rely on them for most of the projects out there. In this demo we are going to include images in our project in two flavours: either via JavaScript or HTML.

📌 We start from sample `04-bootstrap`.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min v8.9) if they are not already installed on your computer.

> ⚠ Verify that you are running at least node v8.x.x and npm 5.x.x by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from `04-bootstrap`. Just copy the project and install:

  ```bash
  npm install
  ```

- Let's run the project again:

  ```bash
  npm start
  ```

- We continue by creating a folder named `content` inside the `src` folder, and adding two images there: [`logo_1`](./src/content/logo_1.png) and [`logo_2`](./src/content/logo_2.png):

  _src/_

  ```bash
  COPY src/content/logo_1.png
  COPY src/content/logo_2.png
  ```

- First flavour: JavaScript. Let's add a div container to place an image.

  _index.html_

  ```diff
    <h1>Check the console log</h1>
  + <div id="imgContainer"></div>
    <div class="card" style="width: 18rem">
  ```

- Let's jump into `index.js` and import [`logo_1`](./src/content/logo_1.png) using JavaScript. Then, let's place it under a `<div>` with a given `id`:

  _src/index.js_

  ```diff
    import "./mystyles.scss";
  + import logoImg from "./content/logo_1.png";

    const user = "John Doe";

    console.log(`Hello ${user}!`);
    console.log("This app is using Vite");

  + const img = document.createElement("img");
  + img.src = logoImg;
  +
  + document.getElementById("imgContainer").appendChild(img);
  ```

  🔎 Check the result in the browser!

- Finally, let's add styles for the image in our sass file:

  _src/mysyles.scss_

  ```diff
    $blue-color: teal;

    .red-background {
      background-color: $blue-color;
    }
  +
  + img {
  +   width: 150px;
  + }
  ```

  🔎 Check again, image should appear resized.

- Now, what if we embedd the second image directly into an HTML `<img>` tag? Let's add [`logo_2.png`](./src/content/logo_2.png) to our `index.html`:

  _src/index.html_

  ```diff
    <h1>Check the console log</h1>
    <div id="imgContainer"></div>
  + <img src="/src/content/logo_2.png" alt="logo lemoncode" />
    <div class="card" style="width: 18rem">
  ```

  🔎 Check the result, we have a second image now.

  🔎 Also, check dev tools `Network` tab and see how both `png` assets are downloaded as modules and HTTP cache is applied as well.

- Finally, let's update our **production** build:

  ```bash
  npm run build
  ```

  🔎 Check both images are included in `dist/assets` folder and, as the rest of the assets, hashing has been added as a cache busting pattern:

  ```bash
  dist
  ├── assets
  │   ├── index.269d697a.css
  │   ├── index.78986298.js
  │   ├── logo_1.6bb1b83d.png
  │   └── logo_2.cce7736d.png
  └── index.html
  ```

  🔎 Also notice in `dist/index.html` how `logo_2.png` source path has been added with its corresponding hash:

  ```html
  <img src="/assets/logo_2.cce7736d.png" alt="logo lemoncode" />
  ```
