function updateInput() {
    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
}

function flip() {
    let card = document.getElementById('main_card');

    anime({
        targets: card,
        scale: [0, 0.9],
        rotateY: 360,
        duration: function (el, i, l) {
            return 6000 + 300 * i;
        },
        elasticity: function (el, i, l) {
            return 200 + 100 * i;
        },
        delay: function (el, i, l) {
            return 700 * i;
        }
    })
}

//function call statements
updateInput();
flip();