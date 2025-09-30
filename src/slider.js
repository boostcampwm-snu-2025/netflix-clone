function generateCarousel(title, items){
    const main = document.querySelector("main");
    const contentRow = document.createElement("section");
    contentRow.classList.add("content-row");
    main.appendChild(contentRow);

    const headerTitle = document.createElement("h1");
    headerTitle.textContent = title;
    contentRow.appendChild(headerTitle);

    const outerCarousel = document.createElement("div");
    outerCarousel.classList.add("outer-carousel");
    contentRow.appendChild(outerCarousel);

    const prevButton = document.createElement("button");
    prevButton.classList.add("prev");
    outerCarousel.appendChild(prevButton);

    const carousel = document.createElement("div");
    carousel.classList.add("carousel");
    outerCarousel.appendChild(carousel);
    
    const rowContainer = document.createElement("div");
    rowContainer.classList.add("row-container");
    carousel.appendChild(rowContainer);

    const nextButton = document.createElement("button");
    nextButton.classList.add("next");
    outerCarousel.appendChild(nextButton);

    items.forEach(item=>{
        const cardWrapper = document.createElement("div");
        cardWrapper.classList.add("content-card-wrapper");
        const link = document.createElement("a");
        link.href = '#';

        const img = document.createElement("img");
        img.classList.add("content-card");
        img.src = item.img;
        img.alt = item.title;
        //add like hover
        const hover = document.createElement("div");
        hover.classList.add("hover-overlay");
        const thumbnail = document.createElement("img");
        const title = document.createElement("h2");
        title.textContent = item.title;
        const buttons = document.createElement("div");
        buttons.classList.add("hover-buttons");

        //count data
         const playCount = parseInt(localStorage.getItem(item.title + "-play")) || 0;
         const likes = parseInt(localStorage.getItem(item.title + "-likes")) || 0;
         const dislikes = parseInt(localStorage.getItem(item.title + "-dislikes")) || 0;


        const playBtn = document.createElement("button");
        playBtn.textContent = `▶ ${playCount}`;
        const dislikeBtn = document.createElement("b");
        dislikeBtn.textContent = `👎${dislikes}`;
        const likeBtn = document.createElement("b");
        likeBtn.textContent = `👍${likes}`;
        playBtn.addEventListener("click", (e) => {
            e.preventDefault(); // prevent the link from navigating
            e.stopPropagation();
            const newCount = (parseInt(localStorage.getItem(item.title + "-play")) || 0) + 1;
            localStorage.setItem(item.title + "-play", newCount);
            playBtn.textContent = `▶ ${newCount}`;
        });

        likeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const newCount = (parseInt(localStorage.getItem(item.title + "-likes")) || 0) + 1;
            localStorage.setItem(item.title + "-likes", newCount);
            likeBtn.textContent = `👍 ${newCount}`;
        });

        dislikeBtn.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            const newCount = (parseInt(localStorage.getItem(item.title + "-dislikes")) || 0) + 1;
            localStorage.setItem(item.title + "-dislikes", newCount);
            dislikeBtn.textContent = `👎 ${newCount}`;
        });
        buttons.append(playBtn, likeBtn, dislikeBtn);
        hover.append(title, buttons);
        
        link.appendChild(hover);
        link.appendChild(img);
        cardWrapper.appendChild(link);
        rowContainer.appendChild(cardWrapper);
    })
}
function initCarousel(carousel){
    const container = carousel.querySelector('.row-container');
    const images = carousel.querySelectorAll('.row-container .content-card-wrapper');
    const nextBtn = carousel.parentElement.querySelector('.next');
    const prevBtn = carousel.parentElement.querySelector('.prev');
//    let i = 1;
    let rowWidth = carousel.offsetWidth;
    let imageWidth = images[0].offsetWidth;
    let imagePerRow = Math.floor(rowWidth/imageWidth);
    
    //infinite carousel feature
    //document selector all treats html element like an array(?)
    const firstClones = [];
    const lastClones = [];
    for (let j = 0; j < imagePerRow; j++) {
        const first = images[j].cloneNode(true);
        const last = images[images.length - imagePerRow + j].cloneNode(true);
        
        first.id = `first-clone-${j}`;
        last.id = `last-clone-${j}`;
        
        firstClones.push(first);
        lastClones.push(last);
    }
    lastClones.forEach(clone => container.insertBefore(clone, container.firstChild));
    firstClones.forEach(clone => container.appendChild(clone));
    let i = imagePerRow;

    container.style.transform = `translateX(${-imageWidth * i}px)`;
    nextBtn.addEventListener("click", ()=>{
        console.log(i);
        console.log(imagePerRow);
        if(i-imagePerRow>=images.length-imagePerRow){
            i=imagePerRow;
            container.style.transition = 'transform 0.4s ease-in-out';
            container.style.transform = `translateX(${-imageWidth*(images.length + imagePerRow)}px)`;
            setTimeout(()=>{
                container.style.transition = 'none';
                container.style.transform=`translateX(${-imageWidth * i}px)`;
            }, 300);
        }
        else{
            if(i>=images.length-imagePerRow) 
                {i =  images.length;
                    console.log("detected");
                    console.log(images.length);
                }
            else{i=i+imagePerRow;}
            container.style.transition = 'transform 0.4s ease-in-out';
            container.style.transform = `translateX(${-imageWidth*i}px)`;
        }
        console.log(i);
    });
    prevBtn.addEventListener("click",()=>{
        if(i==imagePerRow){
            i=imagePerRow+images.length-imagePerRow;
            container.style.transition = 'transform 0.4s ease-in-out';
            container.style.transform = `translateX(${imageWidth*(images.length-imagePerRow)}px)`;
            setTimeout(()=>{
                container.style.transition='none';
                container.style.transform = `translateX(${-imageWidth*i}px)`;
            },300);
        }
        else if(i<imagePerRow+imagePerRow){
            i=imagePerRow;
            container.style.transition = 'transform 0.4s ease-in-out';
            container.style.transform = `translateX(${-imageWidth*i}px)`;
        }
        else{
            if(i-imagePerRow==images.length-imagePerRow){
                i = i-images.length%imagePerRow;
                console.log("detected");
                
            }
            else{i=i-imagePerRow;}
            container.style.transition = 'transform 0.4s ease-in-out';
            container.style.transform = `translateX(${-imageWidth*i}px)`;
        }
        console.log(i);
    });
}
const carousels = [
    { title: "New on Netflix", url: "./src/data/newOnNetflix.json" },
    { title: "Trending Now", url: "./src/data/numbers.json" },
];
carousels.forEach(carouselInfo=>{
    fetch(carouselInfo.url)
    .then(response=>response.json())
    .then(data=>{
        generateCarousel(carouselInfo.title, data);
        const carouselEl = document.querySelectorAll('.carousel');
        const latestCarousel = carouselEl[carouselEl.length - 1];
        initCarousel(latestCarousel);
    }).catch(err => console.error(err));
});
    
