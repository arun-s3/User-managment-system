
const input = document.querySelector('input[name="search"]')
const tbody = document.getElementById("userTableBody")

let timer

input.addEventListener("input", () => {
    clearTimeout(timer)

    timer = setTimeout(async () => {
        const query = input.value.trim()

        const response = await fetch(`/admin/search-user?search=${query}`)
        const users = await response.json()

        tbody.innerHTML = ""

        users.forEach((u, i) => {
            tbody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td style="font-weight:bold; color:#0dcaf0;">${u.name}</td>
                    <td><img src="${u.image}" id="table-img"></td>
                    <td>${u.email}</td>
                    <td>${u.mobile}</td>
                    <td><a href="/admin/edit-user?id=${u._id}">
                        <button class="btn btn-info px-3">Edit</button></a></td>
                    <td><a href="/admin/delete-user?id=${u._id}">
                        <button class="btn btn-danger px-3">Delete</button></a></td>
                </tr>
            `
        })
    }, 300) 
})
