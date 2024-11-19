export const calculateGridDimensions = (containerWidth, containerHeight, items) => {
  const MIN_CARD_WIDTH = 300;
  const CARD_HEIGHT = 400;
  const GRID_GAP = 20;

  const columns = Math.floor((containerWidth - GRID_GAP) / (MIN_CARD_WIDTH + GRID_GAP));
  const cardWidth = Math.floor((containerWidth - (GRID_GAP * (columns + 1))) / columns);
  const rows = Math.ceil(items.length / columns);
  
  return {
    columns,
    rows,
    cardWidth,
    cardHeight: CARD_HEIGHT,
    totalWidth: containerWidth,
    totalHeight: (CARD_HEIGHT + GRID_GAP) * rows
  };
};