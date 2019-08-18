function setMastheadHeight() {
    let height = window.innerHeight;
    console.log(height);
    let masthead = document.querySelector('#masthead_container');
    let setHeight = height + "px";
    console.log(setHeight);
    masthead.setAttribute('style', `height: ${setHeight};`);
}

function headerBottomHoverAnim() {

    document.getElementById('home_header').addEventListener('mouseover', () => {

        let home = document.getElementById('home_header');

        home.style.borderBottom = '2px solid #76D7C4';
    });

    document.getElementById('home_header').addEventListener('mouseout', () => {

        let home = document.getElementById('home_header');

        home.style.borderBottom = 'none';
    });

    document.getElementById('new_post_header').addEventListener('mouseover', () => {

        let home = document.getElementById('new_post_header');

        home.style.borderBottom = '2px solid #76D7C4';
    });

    document.getElementById('new_post_header').addEventListener('mouseout', () => {

        let home = document.getElementById('new_post_header');

        home.style.borderBottom = 'none';
    });

}

function headerAnim() {
    // Wrap every letter in a span
    var textWrapper = document.querySelector('.text-anim .letters');
    textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");
    document.getElementsByClassName('text-anim')[0].style.visibility = 'hidden';

    setTimeout(
        () => {

            document.getElementsByClassName('text-anim')[0].style.visibility = 'visible';
            anime.timeline({
                    loop: true
                })
                .add({
                    targets: '.text-anim .letter',
                    scale: [0, 1.2],
                    duration: function (el, i, l) {
                        return 2500 + 100 * i;
                    },
                    elasticity: function (el, i, l) {
                        return 200 + 200 * i;
                    },
                    delay: function (el, i) {
                        return 45 * (i + 1)
                    }
                })
                .add({
                    targets: '.text-anim',
                    opacity: 0,
                    duration: 1000,
                    delay: 1500,
                    easing: 'easeInOutExpo'
                });
        }, 2000
    )

    // Text wrapper sub heading

    var textWrapperSub = document.querySelector('.text-anim2 .letters2');
    textWrapperSub.innerHTML = textWrapperSub.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter2'>$&</span>");
    document.getElementsByClassName('text-anim2')[0].style.visibility = 'hidden';

    setTimeout(
        () => {

            document.getElementsByClassName('text-anim2')[0].style.visibility = 'visible';
            anime.timeline({
                    loop: true
                })
                .add({
                    targets: '.text-anim2 .letter2',
                    scale: [0, 1.0],
                    duration: function (el, i, l) {
                        return 2500 + 100 * i;
                    },
                    elasticity: function (el, i, l) {
                        return 200 + 200 * i;
                    },
                    delay: function (el, i) {
                        return 45 * (i + 1)
                    }
                })
                .add({
                    targets: '.text-anim2',
                    opacity: 0,
                    duration: 1000,
                    delay: 2500,
                    easing: 'easeInOutExpo'
                });
        }, 2000
    )
}

// Function Calling
setMastheadHeight();
headerBottomHoverAnim();
headerAnim();