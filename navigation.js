//js file for homepage to subsections navigation (overall website navigating)

//top nav menu links
const navLinks = document.querySelectorAll('.nav-link');


//minimizing sidebar
const minimizedBtn = document.getElementById('minimize-btn');
const sidebarState ={isMinimized: false,};

function toggleSidebarMinimize(){
    const sidebar = document.querySelector('.sidebar');
    const mainContainer = document.querySelector('.main-container');
 
    if(!sidebar || !mainContainer) return;
 
    sidebar.classList.toggle('minimized');
    mainContainer.classList.toggle('sidebar-minimized');
}

function setupNavigationListeners(){
    if(minimizedBtn){
        minimizedBtn.addEventListener('click', toggleSidebarMinimize);
    }
}

function navigateTo(sectionId){
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // show section
    const targetSection = document.getElementById(sectionId);
    if(targetSection){
        targetSection.classList.add('active');
    }

    // UPDATE ACTIVE NAV LINK
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    let navLinkText = '';
    if(sectionId === 'home') navLinkText = 'Home';
    else if(sectionId === 'simulation') navLinkText = 'Simulation';
    else if(sectionId === 'practice') navLinkText = 'Practice';
    else if(sectionId === 'formulas') navLinkText = 'Formula Sheet';
    
    if(navLinkText) {
        navLinks.forEach(link => {
            if(link.textContent === navLinkText) {
                link.classList.add('active');
            }
        });
    }

    // RESIZE CANVAS FOR ALL SIM SECTIONS
    if(sectionId === 'sim-dropping' || sectionId === 'sim-throwing' || sectionId === 'sim-speeding' || sectionId === 'sim-braking'){
        setTimeout(() => {
            let canvasId = 'canvas';
            if(sectionId === 'sim-dropping') canvasId = 'canvas-dropping';
            else if(sectionId === 'sim-throwing') canvasId = 'canvas-throwing';
            else if(sectionId === 'sim-speeding') canvasId = 'canvas-speeding';
            else if(sectionId === 'sim-braking') canvasId = 'canvas-braking';
            
            const canvas = document.getElementById(canvasId);
            if(canvas){
                canvas.width = canvas.parentElement.offsetWidth;
                canvas.height = canvas.parentElement.offsetHeight;
                console.log('Canvas restarted at:', canvas.width, 'x', canvas.height);
            }
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setupNavigationListeners();
});

window.addEventListener('load', function() {
    const hash = window.location.hash.slice(1);
    if(hash){
        navigateTo(hash);
    }
});