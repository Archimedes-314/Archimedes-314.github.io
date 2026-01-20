(function () {
    emailjs.init("v5DYTtfPxp9i6UAQn");
})();

document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const status = document.getElementById("form-status");

    if (document.querySelector("input[name='company']").value) {
        return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const title = document.getElementById("title").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        status.textContent = "Please fill in all fields.";
        status.style.color = "red";
        return;
    }

    status.textContent = "Sending...";
    status.style.color = "#333";

    const templateParams = {
        from_name: name,
        from_email: email,
        reply_to: email,
        title: title,
        message: message
    };

    emailjs.send("service_atppor7", "template_hzp075d", templateParams)
        .then(() => {
            return emailjs.send("service_atppor7", "template_u3clwo5", templateParams);
        })
        .then(() => {
            status.textContent = "Message sent successfully. Thank you!";
            status.style.color = "green";
            document.getElementById("contact-form").reset();
        })
        .catch(err => {
            status.textContent = "Failed to send message. Please email directly.";
            status.style.color = "red";
            console.error("EmailJS error:", err);
        });
});