
//eventListener click search button
//generate search box with new search button
//function generateSearchBox
function generateSearchBox(){
    const secondaryNav = document.querySelector('.secondary-navigation');
    const searchIcon = document.querySelector('a.search-element');
    
    const searchBox = document.createElement('div');
    searchBox.className = 'search-box';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder='search titles...';
    input.id = "searchInput";

    const button = document.createElement('button');
    button.id = 'searchBtn';
    button.textContent = '🔍';

    searchBox.appendChild(input);
    searchBox.appendChild(button);

    searchIcon.addEventListener('click', (e)=>{
        console.log("clicked");
        e.preventDefault();
        searchIcon.innerHTML='';
        secondaryNav.insertBefore(searchBox, searchIcon);
        input.focus();
    });
    button.addEventListener('click', handleSearch);
    input.addEventListener('keydown', (e)=>{
        if(e.key==='Enter') handleSearch();
    });
}


//call backend for data
//function searchTitles
async function searchTitles(query){
    const res = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.items;
}
//function debounce
function debounce(fn, delay=300){
    let timeout;
    return(...args) =>{
        clearTimeout(timeout);
        timeout = setTimeout(()=> fn(...args), delay);
    };
}

//clear previous html <main> (hero, slider)
//add forEach item from backend data
//function renderResults
function renderResults(items){
    const main = document.querySelector("main");
    main.innerHTML = ""; //clear hero and slider
    main.style.paddingTop = '80px';

    const searchGrid = document.createElement("div");
    searchGrid.className = "search-grid";
    items.forEach(item=>{
        const card = document.createElement("div");
        card.className = 'content-card-wrapper';
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        const title = document.createElement('p');
        title.textContent = item.name;
        card.appendChild(img);
        card.appendChild(title);
        searchGrid.appendChild(card);
    });
    main.appendChild(searchGrid);
}

//receive query from form
//eventListener click search button or hit ENTER
//const handleSearch (uses searchTitles, debounce, and renderResults)
//  add event Listener for click and enter that triggers handleSearch

const handleSearch = debounce(async ()=>{
    const input = document.getElementById("searchInput");
    if(!input) return;
    const query = input.value.trim();
    if(!query) return;
    const items = await searchTitles(input.value);
    renderResults(items);
}, 300);
generateSearchBox();
