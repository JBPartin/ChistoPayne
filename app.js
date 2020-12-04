const burger = document.getElementById('burger');
const nav = document.getElementById('nav--container');

burger.addEventListener('mousedown', () =>{
    burger.classList.toggle('active');
    nav.classList.toggle('active');
});