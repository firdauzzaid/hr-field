<script>
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
</script>

<script>
  document.getElementById("searchInput").addEventListener("input", function () {
    const filter = this.value.toLowerCase(); // Ambil nilai input dan ubah ke huruf kecil
    const rows = document.querySelectorAll("#dataTable tbody tr"); // Ambil semua baris data

    rows.forEach(row => {
      // Gabungkan semua teks dalam satu baris untuk pencarian
      const rowText = row.textContent.toLowerCase();

      // Tampilkan atau sembunyikan baris berdasarkan kecocokan
      if (rowText.includes(filter)) {
        row.style.display = ""; // Tampilkan baris
      } else {
        row.style.display = "none"; // Sembunyikan baris
      }
    });
  });
</script>