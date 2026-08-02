const answers = document.querySelectorAll(".answer");

answers.forEach(button => {

    button.addEventListener("click", () => {

        answers.forEach(btn => {

            btn.style.background = "";
            btn.style.color = "";

        });

        button.style.background = "#0F4C81";
        button.style.color = "#FFFFFF";

    });

});
