const mobileNav = document.querySelector(".hamburger");
const navbar = document.querySelector(".menubar");

const toggleNav = () => {
  navbar.classList.toggle("active");
  mobileNav.classList.toggle("hamburger-active");
};
mobileNav.addEventListener("click", () => toggleNav());
 
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const faqItem = question.parentElement;
    faqItem.classList.toggle('active');
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
  const dropdowns = document.querySelectorAll('.dropdown-content');
  dropdowns.forEach(dropdown => {
    if (!event.target.closest('.dropdown') && dropdown.parentElement.querySelector('.dropdown-content').style.display === 'block') {
      dropdown.style.display = 'none';
    }
  });
});

// Close mobile menu when clicking a link
document.querySelectorAll('.menubar a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('active');
    mobileNav.classList.remove('hamburger-active');
  });
});
