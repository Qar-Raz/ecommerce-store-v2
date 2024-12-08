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
      images: ['/assets/images/mug.png'],
      price: '1000',
      brand: 'KitchenAid',
      rating: '3.9',
      numReviews: 50,
      stock: 100,
      description:
        'Enjoy your favorite beverage in this sleek black coffee mug, perfect for any occasion.',
      isFeatured: false,
      banner: '/assets/images/mug.png',
    },

    {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      category: 'Electronics',
      images: [
        '/assets/images/iphone-15-pro-max.png',
        '/assets/images/iphone-15-pro-max-2.png',
      ],
      price: '520000',
      brand: 'Apple',
      rating: '4.8',
      numReviews: 150,
      stock: 3,
      description:
        'Experience the latest technology with the new iPhone 16 Pro Max, featuring a stunning display and advanced camera system.',
      isFeatured: true,
      banner: '/assets/images/iphone-15-pro-max.png',
    },

    {
      name: 'Classic Orange Baseball Cap',
      slug: 'classic-orange-baseball-cap',
      category: 'Accessories',
      images: [
        '/assets/images/orange-hat.png',
        '/assets/images/orange-hat.png',
      ],
      price: '1499',
      brand: 'UrbanStyle',
      rating: '4.3',
      numReviews: 28,
      stock: 35,
      description:
        'Vibrant orange baseball cap with adjustable strap, premium cotton construction, and breathable eyelets. Perfect for both casual wear and outdoor activities.',
      isFeatured: false,
      banner: '/assets/images/orange-hat.png',
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
      name: 'PlayStation 5 ',
      slug: 'playstation-5',
      category: 'Gaming Consoles',
      images: [
        '/assets/images/ps5-console.png',
        '/assets/images/ps5-console-2.png',
      ],
      price: '210000',
      brand: 'Sony',
      rating: '4.7',
      numReviews: 200,
      stock: 5,
      description:
        'Take your gaming experience to the next level with the PlayStation 5 , offering enhanced graphics and performance.',
      isFeatured: true,
      banner: '/assets/images/ps5-console.png',
    },

    {
      name: 'PlayStation 5 DualSense Controller',
      slug: 'ps5-dualsense-controller',
      category: 'Gaming Accessories',
      images: [
        '/assets/images/ps5-controller-white.png',
        '/assets/images/ps5-controller-black.png',
      ],
      price: '26999',
      brand: 'Sony',
      rating: '3.2',
      numReviews: 150,
      stock: 12,
      description:
        'Experience gaming like never before with the PS5 DualSense wireless controller. Featuring haptic feedback, adaptive triggers, and a built-in microphone.',
      isFeatured: true,
      banner: '/assets/images/ps5-controller-white.png',
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
    {
      name: 'Classic Black Cotton T-Shirt',
      slug: 'classic-black-cotton-tshirt',
      category: 'Clothing',
      images: [
        '/assets/images/black-shirt.png',
        '/assets/images/black-shirt.png',
      ],
      price: '1999',
      brand: 'Essentials',
      rating: '4.5',
      numReviews: 75,
      stock: 50,
      description:
        'A timeless black cotton t-shirt featuring a comfortable fit, breathable fabric, and versatile design perfect for any casual occasion.',
      isFeatured: false,
      banner: '/assets/images/black-shirt.png',
    },
    {
      name: 'Lacoste Urban Plus High-Top Sneakers',
      slug: 'lacoste-urban-plus-high-top-black',
      category: 'Footwear',
      images: ['/assets/images/shoe.png', '/assets/images/shoe-2.png'],
      price: '29999',
      brand: 'Lacoste',
      rating: '4.6',
      numReviews: 42,
      stock: 15,
      description:
        'Premium Lacoste high-top sneakers in classic black featuring genuine leather upper, signature crocodile branding, and enhanced comfort padding. Perfect blend of sport luxury and urban style.',
      isFeatured: true,
      banner: '/assets/images/shoe.png',
    },
  ],
}

export default sampleData
