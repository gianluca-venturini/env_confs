Key.on('f', ['alt', 'cmd'], () => {
  toggleMaxScreen(Window.focused(), getFocusedScreen);
});

Key.on('g', ['alt', 'cmd'], () => {
  toggleMaxScreen(Window.focused(), getOtherScreen);
});

Key.on('left', ['alt', 'cmd'], () => {
  togglePercentageScreen(Window.focused(), getFocusedScreen, screen => ({
    x: screen.x,
    y: screen.y,
    height: screen.height,
    width: screen.width / 2,
  }));
});

Key.on('right', ['alt', 'cmd'], () => {
  togglePercentageScreen(Window.focused(), getFocusedScreen, screen => ({
    x: screen.x + screen.width / 2,
    y: screen.y,
    height: screen.height,
    width: screen.width / 2,
  }));
});

Key.on('up', ['alt', 'cmd'], () => {
  togglePercentageScreen(Window.focused(), getFocusedScreen, screen => ({
    x: screen.x,
    y: screen.y,
    height: screen.height / 2,
    width: screen.width,
  }));
});

Key.on('down', ['alt', 'cmd'], () => {
  togglePercentageScreen(Window.focused(), getFocusedScreen, screen => ({
    x: screen.x,
    y: screen.y + screen.height / 2,
    height: screen.height / 2,
    width: screen.width,
  }));
});

Key.on('right', ['ctrl', 'alt', 'cmd'], () => {
  moveFocusOnVisibleWindow((windowFrame, maxMargin) => ({
    x: windowFrame.x + windowFrame.width + maxMargin,
    y: windowFrame.y + windowFrame.height / 2,
  }));
});

Key.on('left', ['ctrl', 'alt', 'cmd'], () => {
  moveFocusOnVisibleWindow((windowFrame, maxMargin) => ({
    x: windowFrame.x - maxMargin,
    y: windowFrame.y + windowFrame.height / 2,
  }));
});

Key.on('up', ['ctrl', 'alt', 'cmd'], () => {
  moveFocusOnVisibleWindow((windowFrame, maxMargin) => ({
    x: windowFrame.x + windowFrame.width / 2,
    y: windowFrame.y - maxMargin,
  }));
});

Key.on('down', ['ctrl', 'alt', 'cmd'], () => {
  moveFocusOnVisibleWindow((windowFrame, maxMargin) => ({
    x: windowFrame.x + windowFrame.width / 2,
    y: windowFrame.y + windowFrame.height + maxMargin,
  }));
});

function moveFocusOnVisibleWindow(getSamplePoint) {
  const focusedWindow = Window.focused();
  const maxMargin = 10;
  const samplePoint = getSamplePoint(focusedWindow.frame(), maxMargin);
  const window = Window.at(samplePoint);
  if (!window) {
    Phoenix.log('No window found at point', point.x, point.y);
  }
  if (!window.isVisible()) {
    Phoenix.log('Window disqualified for not being visible', window.title());
    return;
  }
  if (window.screen().identifier() !== focusedWindow.screen().identifier()) {
    Phoenix.log('Window disqualified for not being on the same screen', window.title(), window.screen().identifier(), focusedWindow.screen().identifier());
    return;
  }
  Phoenix.log('Focus on window', window.title());
  window.focus();
}

/** Get the screen with the focus. */
function getFocusedScreen() {
  return Window.focused().screen();
}


/** Get the first screen without the focus. */
function getOtherScreen() {
  const allScreens = Screen.all();
  const focusedScreen = getFocusedScreen();
  if (allScreens.length < 2) {
    Phoenix.notify('Can\'t get other screens. Is only one monitor connected?');
    return focusedScreen;
  }
  const otherScreens = allScreens.filter(screen => screen.identifier() !== focusedScreen.identifier());
  if (otherScreens.length === 0) {
    Phoenix.notify('Can\'t get other screens. Why do two monitors have the same id?');
    return focusedScreen;
  }
  return otherScreens[0];
}

/** Expand the window to full screen. */
function toggleMaxScreen(window, getScreen) {
  togglePercentageScreen(window, getScreen, screen => screen);
}

/** Expand the window to a percentage of the screen. */
function togglePercentageScreen(window, getScreen, getScreenCoordinates) {
  if (!window) return; 

  const screen = getScreen().flippedVisibleFrame();
  const screenCoordinates = getScreenCoordinates(screen);
  
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
