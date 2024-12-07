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
      name: 'Black Coffee Mug',
      slug: 'black-coffee-mug',
      category: 'Home & Kitchen',
      images: [
        '/assets/images/coffee-mug-black.jpeg',
        '/assets/images/coffee-mug-black.jpeg',
      ],
      price: '1000',
      brand: 'KitchenAid',
      rating: '3.9',
      numReviews: 50,
      stock: 100,
      description:
        'Enjoy your favorite beverage in this sleek black coffee mug, perfect for any occasion.',
      isFeatured: false,
      banner: '/assets/images/coffee-mug-black.jpeg',
    },

    {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      category: 'Electronics',
      images: ['/assets/images/ipho.jpeg', '/assets/images/ipho.jpeg'],
      price: '520000',
      brand: 'Apple',
      rating: '4.8',
      numReviews: 150,
      stock: 3,
      description:
        'Experience the latest technology with the new iPhone 16 Pro Max, featuring a stunning display and advanced camera system.',
      isFeatured: true,
      banner: '/assets/images/ipho.jpeg',
    },

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
      name: 'PlayStation 5 Pro',
      slug: 'playstation-5-pro',
      category: 'Gaming Consoles',
      images: ['/assets/images/ps5-pro.jpeg', '/assets/images/ps5-pro.jpeg'],
      price: '210000',
      brand: 'Sony',
      rating: '4.7',
      numReviews: 200,
      stock: 5,
      description:
        'Take your gaming experience to the next level with the PlayStation 5 Pro, offering enhanced graphics and performance.',
      isFeatured: true,
      banner: '/assets/images/ps5-pro.jpeg',
    },

    {
      name: 'LACOSTE TENNIS X NOVAK DJOKOVIC SPORTSUIT JACKET',
      slug: 'lacoste-tennis-x-novak-djokovic-sportsuit-jacket',
      category: "Men's Sweatshirts",
      images: ['/assets/images/p2-1.jpeg', '/assets/images/p2-2.jpeg'],
      price: '12000',
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
      price: '16000',
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
      price: '21000',
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
