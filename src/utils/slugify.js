// A function to slugify a string, replace spaces with hyphens and remove special characters
export const slugify = (str) => {
    return str.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
};