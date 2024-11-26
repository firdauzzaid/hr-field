document.addEventListener("DOMContentLoaded", function () {
  <!-- Flash Messages -->
  {% with messages = get_flashed_messages(with_categories=true) %}
    {% if messages %}
        document.addEventListener("DOMContentLoaded", function () {
          {% for category, message in messages %}
            alert("{{ message }}");
          {% endfor %}
        });
    {% endif %}
  {% endwith %}

  function openModalAdd() {
      document.getElementById("addDataModal").classList.remove("hidden");
  }

  function closeModalAdd() {
    document.getElementById("addDataModal").classList.add("hidden");
  }

  function openModalEdit(id, name, phone, date) {
    document.getElementById("id_edit").value = id;
    document.getElementById("name_edit").value = name;
    document.getElementById("phone_edit").value = phone;
    document.getElementById("date_edit").value = date;

    const editForm = document.getElementById("editDataForm");
    editForm.action = `/edit/${id}`;

    document.getElementById("editDataModal").classList.remove("hidden");
  }

  function closeModalEdit() {
    document.getElementById("editDataModal").classList.add("hidden");
  }

  function searchData() {
  const query = document.getElementById("search").value;

  fetch(`/search?query=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data) => {
        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        data.forEach((row) => {
          const tr = document.createElement("tr");
          tr.classList.add("border-b", "hover:bg-gray-100");

          tr.innerHTML = `
            <td class="py-3 px-6">${row.id}</td>
            <td class="py-3 px-6">${row.name}</td>
            <td class="py-3 px-6">${row.phone}</td>
            <td class="py-3 px-6">${row.date}</td>
            <td class="py-3 px-6 text-center">
              <!-- Edit Button -->
              <button onclick="openModalEdit(${row.id}, '${row.name}', '${row.phone}', '${row.date}')"
                class="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded shadow">
                Edit
              </button>
              <!-- Delete Button -->
              <form action="/delete/${row.id}" method="post" class="inline-block">
                <button type="submit" class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded shadow"
                  onclick="return confirm('Are you sure?')">
                  Delete
                </button>
              </form>
            </td>
          `;

          tableBody.appendChild(tr);
        });
      })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  }

  function printInterviewList() {
    const printContent = `
      <h1 style="text-align: center; margin-bottom: 20px;">Guest List for Interviews</h1>
      <table style="width: 100%; border-collapse: collapse; text-align: left;" border="1">
        <thead>
          <tr>
            <th style="padding: 8px; text-align: center;">No</th>
            <th style="padding: 8px;">Name</th>
            <th style="padding: 8px;">Position Applied</th>
            <th style="padding: 8px;">Date</th>
            <th style="padding: 8px; text-align: center;">Signature</th>
          </tr>
        </thead>
        <tbody>
          ${Array(22).fill(`
            <tr>
              <td style="padding: 10px; text-align: center;">&nbsp;</td>
              <td style="padding: 10px;">&nbsp;</td>
              <td style="padding: 10px;">&nbsp;</td>
              <td style="padding: 10px;">&nbsp;</td>
              <td style="padding: 10px;">&nbsp;</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Guest List Template</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              text-align: center;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
});