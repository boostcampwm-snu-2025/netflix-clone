document.querySelectorAll('.nav-element').forEach(el=>{
    const dropdown = el.querySelector('.dropdown');
    el.addEventListener('mouseenter', ()=>{
        dropdown.classList.add('active');
    });
    el.addEventListener('mouseleave', ()=>{
        dropdown.classList.remove('active');
    });
});