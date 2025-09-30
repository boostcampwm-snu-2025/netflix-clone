import './style.css'
import logo from './img/logo.png'
import profile from './img/profile.png'

document.querySelector<HTMLElement>('header')!.innerHTML = `
            <nav>
                <img src="${logo}">
                <div class ="navigation">
                <ul class = "primary-navigation">
                    <li class="navigation-tab">
                        <a href="">Home</a>
                    </li>
                    <li class="navigation-tab">
                        <a href="">Shows</a>
                    </li>
                    <li class="navigation-tab">
                        <a href="">Movies</a>
                    </li>
                    <li class="navigation-tab">
                        <a href="">Games</a>
                    </li>
                    <li class="navigation-tab">
                        <a href="">New & Popular</a>
                    </li>
                    <li class="navigation-tab">
                        <a href="">My List</a>
                    </li>
                    <li class="navigation-tab">
                        <a href="">Browse by Language</a>
                    </li>
                </ul>
                <div class = "secondary-navigation">
                    <a href="" class = "nav-element">
                        <i class="fa fa-search"></i>
                    </a>
                    <a href="" class = "nav-element">
                        <i class="fa fa-bell"></i>
                        <div class="dropdown">
                            <p>No notifications.</p>
                        </div>
                    </a>
                    <a href="" class = "nav-element profile">
                        <img src="${profile}">
                        <div class = "dropdown">
                            <div class = "other-profile">
                                <img src="${profile}">
                                Mom
                            </div>
                            <div class = "other-profile">
                                <img src="${profile}">
                                Dad
                            </div>
                            <div class = "other-profile">
                                <img src="${profile}">
                                Kids
                            </div>
                        </div>
                    </a>
                </div>
                </div>
            </nav>
`
document.querySelectorAll('.nav-element').forEach(el=>{
    const dropdown = el.querySelector('.dropdown');
    if (dropdown){
      el.addEventListener('mouseenter', ()=>{
        dropdown.classList.add('active');
    });
    el.addEventListener('mouseleave', ()=>{
        dropdown.classList.remove('active');
    });
    }
    
});
