//js file for homepage to subsections navigation (overall website navigating)

//minimizing sidebar
const sidebarState ={isMinimized: false,};

function toggleSidebar(){
    const sidebar = document.querySelector('.sidebar');
    const mainContainer = document.querySelector('.main-container');

    if(!sidebar || !mainContainer) return;

    sidebarState.isMinimized =!sidebarState.isMinimized;
    if(sidebarState.isMinimized){
        addClass(sidebar, 'minimized');
        addClass(mainContainer, 'sidebar-minimized');
        logPhysics('Sidebar minimized');
    } else{
        removeClass(sidebar, 'minimized');
        removeClass(mainContainer, 'minimized');
        logPhysics('Sidebar expanded');
        
    }
}