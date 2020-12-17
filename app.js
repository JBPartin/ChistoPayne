const burger = document.getElementById('burger');
const nav = document.getElementById('nav__container');
let hasinteracted = false;
let timeout;

//read data.json
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}
//carousel activate next
function switchcurrent(prev, next) {
    if (prev === next)
        return;
    const query = Array.from(document.querySelector('.indicator').children);
    const projects = Array.from(document.querySelector('.carousel').children);
    const indcator = query[next];
    const oldindcator = query[prev];
    const olddiv = projects[prev];
    const div = projects[next];
    div.classList.add('project--visible');
    olddiv.classList.remove('project--visible');
    oldindcator.classList.remove('current');
    indcator.classList.add('current');
}

//carousel interaction timeout
function addtime() {
    hasinteracted = true;
    if (timeout === undefined) {
        timeout = setTimeout(() => {
            hasinteracted = false;
            timeout = undefined;
        }, 10000);
    } else {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            hasinteracted = false;
            timeout = undefined;
        }, 10000);
    }
}
//click events
document.addEventListener('click', (event) => {
    const query = Array.from(document.querySelector('.indicator').children);
    const projects = Array.from(document.querySelector('.carousel').children);
    if (event.target === undefined)
        return;
    if (query.includes(event.target)) {
        const prev = query.indexOf(document.querySelector('.current'));
        const next = query.indexOf(event.target);
        switchcurrent(prev, next);
        addtime();
    }
    if (burger == event.target || Array.from(burger.children).includes(event.target)) {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
    } else {
        if (burger.classList.contains('active')) {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
        }
    }
    if (Array.from(event.target.classList).includes('fa-chevron-left')) {
        const prev = query.indexOf(document.querySelector('.current'));
        if (prev - 1 >= 0)
            switchcurrent(prev, prev - 1);
        else
            switchcurrent(prev, query.length - 1);
        addtime();
    } else if (Array.from(event.target.classList).includes('fa-chevron-right')) {
        const prev = query.indexOf(document.querySelector('.current'));
        if (query.length > prev + 1)
            switchcurrent(prev, prev + 1);
        else
            switchcurrent(prev, 0);
        addtime();
    }
});

//swipe effect for mobile
let touch = {
    start: null,
    up: null,
    area: null
}
window.addEventListener('touchstart', (event) => {
    touch.start = event.changedTouches[0].pageX;
    touch.up = event.changedTouches[0].pageY;
    const projects = Array.from(document.querySelector('.carousel').children);
    for (let x in projects) {
        if (!Array.from(projects[x].classList).includes('project--visible'))
            continue;
        if (projects[x].getBoundingClientRect().bottom > 350 && projects[x].getBoundingClientRect().top < 350) {
            touch.area = true;
        } else {
            touch.area = false;
        }
    }
});
window.addEventListener('touchend', (event) => {
    if (touch.area == false)
        return;
    const query = Array.from(document.querySelector('.indicator').children);
    const prev = query.indexOf(document.querySelector('.current'));
    let end = event.changedTouches[0].pageX;
    let down = event.changedTouches[0].pageY;
    let ydifference = down > touch.up ? down - touch.up : touch.up - down;
    let xdifference = end > touch.start ? end - touch.start : touch.start - end;
    if (ydifference < xdifference) {
        if (touch.start > end) {
            if (query.length > prev + 1)
                switchcurrent(prev, prev + 1);
            else
                switchcurrent(prev, 0);
            addtime();
        } else {
            if (prev - 1 >= 0)
                switchcurrent(prev, prev - 1);
            else
                switchcurrent(prev, query.length - 1);
            addtime();
        }
    }
});
//on load event
window.addEventListener('load', () => {
    //loading json data
    const carousel = document.querySelector('.carousel');
    const indicator = document.querySelector('.indicator');
    readTextFile("data.json", function (text) {
        var data = JSON.parse(text);
        for (let x in data.projects) {
            let div = document.createElement("div");
            let container = document.createElement("div");
            container.classList.add('project__container');
            if (x == 0)
                div.classList.add('project--visible');
            div.classList.add('project');
            let h1 = document.createElement("h3");
            let name = document.createTextNode(data.projects[x].name);
            let img = document.createElement('img');
            let p = document.createElement('p');
            let desc = document.createTextNode(data.projects[x].description);
            let jsoncode = data.projects[x].codelink;
            let jsondemo = data.projects[x].demolink;
            let buttondiv = document.createElement('div');
            if (jsoncode != 'none') {
                let code = document.createElement('a');
                code.href = jsoncode;
                code.innerHTML = "Code";
                buttondiv.appendChild(code);
            }
            if (jsondemo != 'none') {
                let demo = document.createElement('a');
                demo.href = jsondemo;
                demo.innerHTML = "Demo";
                buttondiv.appendChild(demo);
            }
            buttondiv.classList.add('project__btns');
            img.src = 'images/' + data.projects[x].image;
            h1.appendChild(name);
            p.appendChild(desc);
            div.appendChild(h1);
            container.appendChild(img);
            container.appendChild(p);
            container.appendChild(buttondiv);
            div.appendChild(container);
            carousel.appendChild(div);
            let button = document.createElement('button');
            if (x == 0)
                button.classList.add('current');
            indicator.appendChild(button);
        }
        //carousel scrolling
        const query = Array.from(document.querySelector('.indicator').children);
        setInterval(() => {
            if (!hasinteracted) {
                const prev = query.indexOf(document.querySelector('.current'));
                if (query.length > prev + 1)
                    switchcurrent(prev, prev + 1);
                else
                    switchcurrent(prev, 0);
            }
        }, 5000);
    });
    //intial animation
    const contentlist = document.querySelectorAll('.flow__object');
    for (let content in contentlist) {
        if (content >= 0) {
            const position = contentlist[content].getBoundingClientRect().top;
            const windowheight = window.innerHeight;
            if (position < windowheight) {
                contentlist[content].classList.add('flow');
            } else {
                contentlist[content].classList.remove('flow');
            }
        }
    }
});
//scroll events
window.addEventListener('scroll', () => {
    const contentlist = document.querySelectorAll('.flow__object');
    for (let content in contentlist) {
        if (content >= 0) {
            const position = contentlist[content].getBoundingClientRect().top;
            const windowheight = window.innerHeight;
            if (position < windowheight) {
                contentlist[content].classList.add('flow');
            } else {
                contentlist[content].classList.remove('flow');
            }
        }
    }
});