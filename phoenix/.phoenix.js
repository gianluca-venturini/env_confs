Key.on('f', ['alt', 'cmd'], () => {
  toggleMaxScreen(Window.focused());
});

Key.on('left', ['alt', 'cmd'], () => {
  togglePercentageScreen(Window.focused(), screen => ({
    x: screen.x,
    y: screen.y,
    height: screen.height,
    width: screen.width / 2,
  }));
});

Key.on('right', ['alt', 'cmd'], () => {
  togglePercentageScreen(Window.focused(), screen => ({
    x: screen.x + screen.width / 2,
    y: screen.y,
    height: screen.height,
    width: screen.width / 2,
  }));
});

Key.on('up', ['alt', 'cmd'], () => {
  togglePercentageScreen(Window.focused(), screen => ({
    x: screen.x,
    y: screen.y,
    height: screen.height / 2,
    width: screen.width,
  }));
});

Key.on('down', ['alt', 'cmd'], () => {
  togglePercentageScreen(Window.focused(), screen => ({
    x: screen.x,
    y: screen.y + screen.height / 2,
    height: screen.height / 2,
    width: screen.width,
  }));
});

function toggleMaxScreen(window) {
  togglePercentageScreen(window, screen => screen);
}

function togglePercentageScreen(window, setScreenCoordinates) {
  if (!window) return; 

  const screen = window.screen().flippedVisibleFrame();
  const screenCoordinates = setScreenCoordinates(screen);
  
  window.setTopLeft({
    x: screenCoordinates.x, 
    y: screenCoordinates.y,
  }); 

  if(window.size().width !== screenCoordinates.width || window.size().height !== screenCoordinates.height){
    window.setSize({
      height: screenCoordinates.height, 
      width: screenCoordinates.width
    });
  }
}
