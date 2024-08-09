document.addEventListener("DOMContentLoaded", function () {
    var openPdfLink = document.getElementById("openPdf");
    openPdfLink.addEventListener("click", function () {
        window.open("Updated_complete_eligible_list.pdf", "_blank"); // Opens the PDF in a new tab
    });
});
