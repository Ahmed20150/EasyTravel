// src/utils/scrollManager.js
export const createScrollManager = () => {
    let scrollPositions = new Map();
  
    return {
      savePosition: (key, position) => {
        scrollPositions.set(key, position);
      },
      getPosition: (key) => scrollPositions.get(key),
      clearPosition: (key) => scrollPositions.delete(key)
    };
  };