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


// Function Calling
setMastheadHeight();
headerBottomHoverAnim();