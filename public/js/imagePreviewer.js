const fileInput = document.getElementById("file")
const previewImg = document.getElementById("profilePreview")

fileInput.addEventListener("change", function () {
    const file = this.files[0]

    if (file) {
        const reader = new FileReader()
        reader.onload = function (e) {
            previewImg.src = e.target.result
            previewImg.style.display = "inline-block"
            previewImg.style.opacity = 0
            previewImg.style.transition = "opacity 0.3s ease"

            setTimeout(() => {
                previewImg.style.opacity = 1
            }, 10)
        }
        reader.readAsDataURL(file)
    }
})