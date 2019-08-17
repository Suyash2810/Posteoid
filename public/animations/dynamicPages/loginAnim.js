function login_form_anim() {
    let form = document.getElementById('login_form');
    form.style.visibility = 'hidden';

    setTimeout(
        () => {
            document.getElementById('login_form').style.visibility = 'visible';
            anime({
                targets: document.querySelector('#login_form'),
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
}

function footerAnimation() {
    document.getElementById('twitter_logo').addEventListener('mouseover', () => {

        let twitter_logo = document.getElementById('twitter_logo');

        anime({
            targets: twitter_logo,
            scale: 1.1,
            elasticity: function (el, i, l) {
                return 200 + (200 * i);
            }
        });
    });

    document.getElementById('twitter_logo').addEventListener('mouseout', () => {

        let twitter_logo = document.getElementById('twitter_logo');

        anime({
            targets: twitter_logo,
            scale: 1.0,
            elasticity: function (el, i, l) {
                return 200 + (200 * i);
            }
        });
    });

    document.getElementById('facebook_logo').addEventListener('mouseover', () => {

        let facebook_logo = document.getElementById('facebook_logo');

        anime({
            targets: facebook_logo,
            scale: 1.1,
            elasticity: function (el, i, l) {
                return 200 + (200 * i);
            }
        });
    });

    document.getElementById('facebook_logo').addEventListener('mouseout', () => {

        let facebook_logo = document.getElementById('facebook_logo');

        anime({
            targets: facebook_logo,
            scale: 1.0,
            elasticity: function (el, i, l) {
                return 200 + (200 * i);
            }
        });
    });

    document.getElementById('github_logo').addEventListener('mouseover', () => {

        let github_logo = document.getElementById('github_logo');

        anime({
            targets: github_logo,
            scale: 1.1,
            elasticity: function (el, i, l) {
                return 200 + (200 * i);
            }
        });
    });

    document.getElementById('github_logo').addEventListener('mouseout', () => {

        let github_logo = document.getElementById('github_logo');

        anime({
            targets: github_logo,
            scale: 1.0,
            elasticity: function (el, i, l) {
                return 200 + (200 * i);
            }
        });
    });
}

// Function calling
footerAnimation();
login_form_anim();