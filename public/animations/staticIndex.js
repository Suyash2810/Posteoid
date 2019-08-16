$(document).ready(function () {
    setTimeout(
        () => {
            document.getElementsByClassName('subheading')[0].style.visibility = 'visible';
            anime.timeline({
                    loop: true
                })
                .add({
                    targets: '.ml8 .circle-white',
                    scale: [0, 1.5],
                    opacity: [1, 0],
                    easing: "easeInOutExpo",
                    rotateZ: 360,
                    duration: 1100,
                    backgroundColor: '#76D7C4',
                    elasticity: function (el, i, l) {
                        return 200 + (200 * i);
                    },
                    delay: function (el, i, l) {
                        return 100 * i;
                    }
                }).add({
                    targets: '.ml8 .circle-container',
                    scale: [0, 1],
                    duration: 1100,
                    easing: "easeInOutQuad",
                    offset: '-= 1000 '
                }).add({
                    targets: '.ml8 .circle-dark',
                    scale: [0, 1],
                    duration: 1100,
                    easing: "easeOutExpo",
                    offset: '-=600'
                }).add({
                    targets: '.ml8 .letters-left',
                    scale: [0, 1],
                    duration: 1200,
                    offset: '-=550'
                }).add({
                    targets: '#bang',
                    scale: [0, 1],
                    rotateZ: [45, 15],
                    duration: 1200,
                    easing: 'easeInOutSine',
                    offset: '+=100'
                }).add({
                    targets: '.ml8',
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutExpo",
                    delay: 1400
                });

            anime({
                targets: '.ml8 .circle-dark-dashed',
                rotateZ: 360,
                duration: 8000,
                easing: "linear",
                loop: true
            });
        }, 2000
    );

    setTimeout(
        () => {
            document.getElementById('blogSvg').style.visibility = 'visible';
            anime({
                targets: 'path',
                strokeDashoffset: [anime.setDashoffset, 0],
                easing: 'easeInOutSine',
                duration: 1500,
                delay: function (el, i) {
                    return i * 250
                },
                direction: 'alternate',
                loop: true
            });
        }, 2000
    );
});