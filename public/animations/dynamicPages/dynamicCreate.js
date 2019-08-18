function setMastheadHeight() {
    let height = window.innerHeight;
    console.log(height);
    let masthead = document.querySelector('#masthead_container');
    let setHeight = height + "px";
    console.log(setHeight);
    masthead.setAttribute('style', `height: ${setHeight};`);
}






// Function callers
setMastheadHeight();