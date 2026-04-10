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

    //show section
    const targetSection = document.getElementById(sectionId);
    if(targetSection){
        targetSection.classList.add('active');
    }

    //ensures my code in freefalling-sim.js WORKS! AND DOESNT INTERFEERE (PLEASEEEEEEEEE I NEED THIS)

    if(sectionId === 'sim-dropping'){
        // Wait a tiny bit for the section to become visible, then resize canvas
        setTimeout(() => {
            const canvas = document.getElementById('canvas');
            if(canvas){
                // Recalculate canvas size based on its now-visible parent
                canvas.width = canvas.parentElement.offsetWidth;
                canvas.height = canvas.parentElement.offsetHeight;
                console.log('Canvas restarted at:', canvas.width, 'x', canvas.height);
            }
        }, 100);  // 100ms delay
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
