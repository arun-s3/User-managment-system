  
  const table = document.querySelector("table")
  const headers = document.querySelectorAll(".sortable")
  let sortState = {} 

  headers.forEach((header, colIndex) => {
    sortState[colIndex] = true // true = asc

    header.addEventListener("click", () => {
      const tbody = document.getElementById("userTableBody")
      const tbodyRows = Array.from(tbody.querySelectorAll("tr"))

      const asc = sortState[colIndex]
      sortState[colIndex] = !asc

      tbodyRows.sort((a, b) => {
        let A = a.children[colIndex].innerText.trim()
        let B = b.children[colIndex].innerText.trim()

        // sort for id & mobile
        if (colIndex === 0 || colIndex === 4) {
          return asc ? A - B : B - A
        }

        return asc ? A.localeCompare(B) : B.localeCompare(A);
      })

      tbodyRows.forEach(row => row.remove())

      tbody.append(...tbodyRows)

      headers.forEach((h) => {
          h.querySelector(".arrow").textContent = "↕"
          h.classList.remove("asc", "desc")
      })
      header.classList.add(asc ? "asc" : "desc")

    })
  });

