import './mystyles.scss';
import logoImg from 'url:./content/logo_1.png';

const user = "John Doe";

console.log(`Hello ${user}!`);

const img = document.createElement('img');
img.src = logoImg;

document.getElementById('imgContainer').appendChild(img);