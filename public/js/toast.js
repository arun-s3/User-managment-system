
document.addEventListener("DOMContentLoaded", () => {
    if (!window.__TOAST__) return

    const toast = document.getElementById("toast")

    toast.textContent = window.__TOAST__.message
    toast.classList.add("show", window.__TOAST__.type)

    setTimeout(() => {
        toast.classList.remove("show")
    }, 3000)
})
