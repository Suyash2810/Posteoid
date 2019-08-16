$(document).ready(function () {

    let form = document.getElementById('contact_form');
    form.style.visibility = 'hidden';

    setTimeout(
        () => {
            document.getElementById('contact_form').style.visibility = 'visible';
            anime({
                targets: document.querySelector('#contact_form'),
                scale: [0, 1],
                duration: function (el, i, l) {
                    return 3000 + 100 * i;
                },
                delay: function (el, i, l) {
                    return 300 * i;
                },
                elasticity: function (el, i, l) {
                    return 200 + (200 * i);
                }
            })
        }, 2000
    );

    function sendBtnAnim() {

        let sendbtn = document.getElementById('send_btn');

        sendbtn.addEventListener('mouseover', () => {

            anime({
                targets: sendbtn,
                scale: 1.1,
                duration: 500,
                elasticity: function () {
                    return 200 + 200 * i;
                }
            });
        });

        sendbtn.addEventListener('mouseout', () => {
            anime({
                targets: sendbtn,
                scale: 1.0,
                duration: 500,
                elasticity: function () {
                    return 200 + 200 * i;
                }
            });
        })
    }

    sendBtnAnim();
});