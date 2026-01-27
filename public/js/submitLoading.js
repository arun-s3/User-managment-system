
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form")
    const btn = document.getElementById("submitBtn")

    if (!form || !btn) return

    form.addEventListener("submit", () => {
        btn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-1"></span>
            Submitting...
        `
        btn.disabled = true
        btn.style.opacity = "0.7"
        btn.style.cursor = "not-allowed"
    })
})
