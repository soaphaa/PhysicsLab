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
}

document.addEventListener('DOMContentLoaded', function() {
    setupNavigationListeners();
});

