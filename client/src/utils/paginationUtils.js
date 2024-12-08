export const calculatePages = (totalItems, itemsPerPage) => Math.ceil(totalItems / itemsPerPage);

export const getPageItems = (items, currentPage, itemsPerPage) => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
};