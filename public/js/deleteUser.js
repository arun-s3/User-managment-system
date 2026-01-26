
function showToast(textContent, type) {
    const toast = document.getElementById("toast")

    toast.textContent = textContent
    toast.classList.add("show", type)

    setTimeout(() => {
        toast.classList.remove("show")
    }, 3000)
}

document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
        const id = btn.dataset.id

        if (!confirm("Are you sure you want to delete this user?")) return

        try {
            const res = await fetch(`/admin/delete-user?id=${id}`, {
                method: "DELETE",
            })

            const data = await res.json()

            if (data.success) {

                btn.closest("tr").remove()

                showToast(data.message, "success")
            } else {
                showToast(data.message, "error")
            }
        } catch (err) {
            showToast("Something went wrong", "error")
        }
    })
})
