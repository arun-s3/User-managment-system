
    const toggle = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");
    const eyeOpen = document.getElementById("eyeOpen");
    const eyeClosed = document.getElementById("eyeClosed");

    if (toggle) {
        toggle.addEventListener("click", () => {
            const isPassword = passwordInput.type === "password"
            passwordInput.type = isPassword ? "text" : "password"
            eyeOpen.style.display = isPassword ? "none" : "block";
            eyeClosed.style.display = isPassword ? "block" : "none";
        });
    }
