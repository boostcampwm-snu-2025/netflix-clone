document.querySelectorAll('.carousel').forEach(carousel => {
    const container = carousel.querySelector('.row-container');
    const images = carousel.querySelectorAll('.row-container a');
    const nextBtn = carousel.parentElement.querySelector('.next');
    const prevBtn = carousel.parentElement.querySelector('.prev');
    let i = 1;
    let rowWidth = carousel.offsetWidth;
    let imageWidth = images[0].offsetWidth;
    //infinite carousel feature
    //document selector all treats html element like an array(?)
    const firstClone = images[0].cloneNode(true);
    const lastClone = images[images.length -1].cloneNode(true);
    const firstImage = container.querySelector('a');
    firstClone.id = 'first-clone';
    lastClone.id = 'last-clone';

    container.appendChild(firstClone); //so first clone appears at the end
    container.insertBefore(lastClone, firstImage); //so last clone can show up before first element
    
    const allImages = carousel.querySelectorAll(".row-container a");
    
    //initial position
    container.style.transform = `translateX(${-imageWidth * i}px)`;

    nextBtn.addEventListener("click", ()=>{
        if(i>=allImages.length-1) return;
        i++;
        container.style.transition = 'transform 0.4s ease-in-out';
        container.style.transform = `translateX(${-imageWidth*i}px)`;
    });
    prevBtn.addEventListener("click",()=>{
        if(i<=0) return;
        i--;
        container.style.transition = 'transform 0.4s ease-in-out';
        container.style.transform = `translateX(${-imageWidth*i}px)`;

    });

    //loop reset
    container.addEventListener('transitionend', ()=>{
        const current = allImages[i];
        if (allImages[i].id==='first-clone'){
            container.style.transition='none';
            i=1;
            container.style.transform=`translateX(${-imageWidth*i}px)`;
        }
        if (current.id ==='last-clone'){
            container.style.transition = 'none';
            i = allImages.length-2;
            container.style.transform=`translateX(${-imageWidth*i}px)`;
        }
    })
})