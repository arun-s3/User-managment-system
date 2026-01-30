
document.addEventListener("DOMContentLoaded", () => {
    if (!window.CORTEX_TOAST) return

    const toast = document.getElementById("toast")

    toast.textContent = window.CORTEX_TOAST.message
    toast.classList.add("show", window.CORTEX_TOAST.type)

    setTimeout(() => {
        toast.classList.remove("show")
    }, 3000)
})
