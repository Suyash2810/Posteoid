$(document).ready(function () {


    document.getElementById('home_header').addEventListener('mouseover', () => {

        let home = document.getElementById('home_header');

        home.style.borderBottom = '2px solid #76D7C4';
    });

    document.getElementById('home_header').addEventListener('mouseout', () => {

        let home = document.getElementById('home_header');

        home.style.borderBottom = 'none';
    });

    document.getElementById('about_header').addEventListener('mouseover', () => {

        let home = document.getElementById('about_header');

        home.style.borderBottom = '2px solid #76D7C4';
    });

    document.getElementById('about_header').addEventListener('mouseout', () => {

        let home = document.getElementById('about_header');

        home.style.borderBottom = 'none';
    });

    document.getElementById('post_header').addEventListener('mouseover', () => {

        let home = document.getElementById('post_header');

        home.style.borderBottom = '2px solid #76D7C4';
    });

    document.getElementById('post_header').addEventListener('mouseout', () => {

        let home = document.getElementById('post_header');

        home.style.borderBottom = 'none';
    });

    document.getElementById('contact_header').addEventListener('mouseover', () => {

        let home = document.getElementById('contact_header');

        home.style.borderBottom = '2px solid #76D7C4';
    });

    document.getElementById('contact_header').addEventListener('mouseout', () => {

        let home = document.getElementById('contact_header');

        home.style.borderBottom = 'none';
    });
});