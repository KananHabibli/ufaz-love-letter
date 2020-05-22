
const toggleMenuButton = document.querySelector('.Menu--Toggle')
const Menu = document.querySelector('.Menu')
const Backdrop = document.querySelector('.backdrop')
const exitMenuButton = document.querySelector('.Menu--Exit')
const fullScreenButton = document.querySelector('#Menu--Button--Fullscreen')

const toFullscreen = () => {
    if(document.fullscreenElement){
     if(document.exitFullscreen)
     document.exitFullscreen();
   else if(document.mozCancelFullScreen)
     document.mozCancelFullScreen();
   else if(document.webkitExitFullscreen)
     document.webkitExitFullscreen();
   else if(document.msExitFullscreen)
     document.msExitFullscreen();
    }else{
     const elem = document.documentElement;
     if (elem.requestFullscreen) {
       elem.requestFullscreen();
     } else if (elem.mozRequestFullScreen) { /* Firefox */
       elem.mozRequestFullScreen();
     } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
       elem.webkitRequestFullscreen();
     } else if (elem.msRequestFullscreen) { /* IE/Edge */
       elem.msRequestFullscreen();
     }
    }
   }

toggleMenuButton.addEventListener('click', function(){
    Menu.style.transform = 'translateX(0)'
    Backdrop.style.display = 'block'
    toggleMenuButton.style.opacity = '0'
    toggleMenuButton.style.transform = 'translateX(-6rem)'
})

exitMenuButton.addEventListener('click', function(){
    Menu.style.transform = ''
    Backdrop.style.display = 'none'
    toggleMenuButton.style.opacity = ''
    toggleMenuButton.style.transform = ''
})

fullScreenButton.addEventListener('click', toFullscreen)
