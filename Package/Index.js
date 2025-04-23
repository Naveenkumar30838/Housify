import imageUrlBuilder from '@sanity/image-url';
const builder = imageUrlBuilder(sanityClient);
const url = builder.image(source).width(300).url(); // Example for a specific width
console.log(url)