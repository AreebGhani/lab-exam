$(document).ready(function () {
  const form = $("form");
  const filesTableBody = $("#filesTable tbody");
  const categoryFilter = $("#categoryFilter");

  function addRow(file) {
    const row = `
        <tr data-category="${file.category}">
            <td>${
              file.path.match(/\.(jpeg|jpg|png)$/)
                ? `<img src="${window.location.origin}${file.path}" alt="${file.fileName}" width="50" />`
                : ""
            }</td>
            <td>${file.fileName}</td>
            <td>${file.category}</td>
            <td>${file.size}</td>
            <td><a href="${window.location.origin}${
      file.path
    }" target="_blank">View</a></td>
            <td><a href="#" class="delete" data-path="${
              file.path
            }">Delete</a></td>
        </tr>
    `;
    filesTableBody.append(row);
  }

  // Function to filter table rows by category
  function filterTable(category) {
    if (category === "all") {
      $("#filesTable tbody tr").show();
    } else {
      $("#filesTable tbody tr").hide();
      $(`#filesTable tbody tr[data-category="${category}"]`).show();
    }
  }

  $.getJSON("/uploads.json", function (data) {
    data.forEach((file) => addRow(file));
  });

  form.on("submit", function (e) {
    e.preventDefault();
    $("form").append('<p id="loading">Loading...</p>');
    $("#success").remove();
    $("#error").remove();
    const formData = new FormData(this);
    $.ajax({
      url: form.attr("action"),
      type: form.attr("method"),
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        $("#loading").remove();
        $("#error").remove();
        $("form").append('<p id="success">File uploaded successfully!</p>');
        response.files.forEach((file) => addRow(file));
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#loading").remove();
        $("#success").remove();
        $("form").append(
          '<p id="error">Error uploading file: ' + errorThrown + "</p>"
        );
      },
    });
    setTimeout(() => {
      $("#success").remove();
      $("#error").remove();
      $("#loading").remove();
    }, 3000);
  });

  filesTableBody.on("click", ".delete", function (e) {
    e.preventDefault();
    const row = $(this).closest("tr");
    const filePath = $(this).data("path");

    $.ajax({
      url: "/",
      type: "DELETE",
      data: { path: filePath },
      success: function (response) {
        row.remove();
        alert("File deleted successfully!");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("Error while deleting this file");
      },
    });
  });

  categoryFilter.on("change", function () {
    filterTable($(this).val());
  });
});
