(function () {
    emailjs.init("v5DYTtfPxp9i6UAQn");
})();

document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const status = document.getElementById("form-status");

    if (document.querySelector("input[name='company']").value) {
        return;
    }

    const nameInput = document.getElementById("name")
    const name = nameInput?.value.trim() || "there";
    const emailInput = document.getElementById("email")
    const email = emailInput?.value.trim() || "archimedes314notes@gmail.com";
    const title = document.getElementById("title").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!title || !message) {
        status.textContent = "Please fill in all fields.";
        status.style.color = "red";
        return;
    }

    status.textContent = "Sending...";
    status.style.color = "#333";

    const params = {
        from_name: name,
        from_email: email,
        title: title,
        message: message
    };

        emailjs.send("service_atppor7", "template_hzp075d", params)
        .then(() => {
            status.textContent = "Message sent successfully. Thank you!";
            status.style.color = "green";
            document.getElementById("contact-form").reset();
        })
        .catch(err => {
            console.warn("EmailJS issue:", err);
            status.textContent =
                "Your message was likely sent, but an error occurred. If you don't hear back from me within 3 business days, please email directly.";
            status.style.color = "#b36b00";
        });
});