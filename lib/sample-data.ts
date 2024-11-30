import { hashSync } from 'bcrypt-ts-edge'

const sampleData = {
  users: [
    {
      name: 'John',
      email: 'admin@example.com',
      password: hashSync('123456', 10),
      role: 'admin',
    },
    {
      name: 'Jane',
      email: 'jane@example.com',
      password: hashSync('123456', 10),
      role: 'user',
    },
  ],

  // define slugs in the form slug-in-lowercase-with-dashes

  products: [
    {
      name: 'Umar',
      slug: 'umar-hussain-blue-shirt',
      category: "Men's Shirt",
      images: ['/assets/images/Umar.jpeg', '/assets/images/Umar.jpeg'],
      price: '10',
      brand: 'Nike',
      rating: '4.5',
      numReviews: 10,
      stock: 5,
      description:
        'Beautiful and comfortable loose fit blue shirt made with 100% cotton',
      isFeatured: true,
      banner: '/assets/images/banner-1.jpeg',
    },
    {
      name: 'LACOSTE TENNIS X NOVAK DJOKOVIC SPORTSUIT JACKET',
      slug: 'lacoste-tennis-x-novak-djokovic-sportsuit-jacket',
      category: "Men's Sweatshirts",
      images: ['/assets/images/p2-1.jpeg', '/assets/images/p2-2.jpeg'],
      price: '199.90',
      brand: 'Lacoste',
      rating: '4.2',
      numReviews: 8,
      stock: 10,
      description:
        'Hit the courts like Novak Djokovic with this seamless stretch jacket, made to move your way.',
      isFeatured: true,
      banner: '/assets/images/banner-2.jpeg',
    },
    {
      name: 'SHOWERPROOF SPORTSUIT TRACK PANTS',
      slug: 'showerproof-sportsuit-track-pants',
      category: 'Track Pants',
      images: ['/assets/images/p3-1.jpeg', '/assets/images/p3-2.jpeg'],
      price: '149.95',
      brand: 'Nike',
      rating: '4.9',
      numReviews: 3,
      stock: 0,
      description:
        'Stay stylish, whatever the weather. These showerproof track pants are here to protect you from the rain. ',
    },
    {
      name: "MEN'S LACOSTE SPORT FRENCH CAPSULE TRACKSUIT PANTS",
      slug: 'mens-lacoste-sport-french-capsule-tracksuit-pants',
      category: 'Track Pants',
      images: ['/assets/images/p4-1.jpeg', '/assets/images/p4-2.jpeg'],
      price: '125.95',
      brand: 'Lacoste',
      rating: '3.6',
      numReviews: 5,
      stock: 10,
      description:
        'A tricolour design brings a distinctive edge to these lightweight tracksuit pants made of diamond taffeta. ',
    },
  ],
}

export default sampleData
