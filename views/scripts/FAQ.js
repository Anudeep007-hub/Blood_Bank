document.addEventListener("DOMContentLoaded", function(){
const faqs = document.querySelectorAll(".accordion-link");
faqs.forEach(faq => {
    faq.addEventListener("click", () => {

        faq.classList.toggle("show");

        faqs.forEach(otherFaq => {
            if (otherFaq !== faq) {
                otherFaq.classList.remove("active");
            }
        });
    });
});
});
