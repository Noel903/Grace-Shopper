const { 
    createUser,
    createProducts,
    createReview,
    createOrder,
    createCheckout
} = require('./index');

const { 
    client
} = require('./client');


async function buildTables() {
  try {

    console.log('Dropping All Tables...');
      
    client.connect();
  
    await  client.query(`
        DROP TABLE IF EXISTS checkouts;
        DROP TABLE IF EXISTS reviews;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS users;
    `)

    console.log('finished to dropping tables')

    console.log('Starting to build tables')

    await  client.query(`
        CREATE TABLE users(
        id SERIAL PRIMARY KEY, 
        username VARCHAR(255) NOT NULL, 
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        "isAdmin" BOOLEAN DEFAULT false,
        UNIQUE (username, email)
        );
    `)

    console.log('users done')

    await  client.query(`
        CREATE TABLE products(
        id SERIAL PRIMARY KEY, 
        title VARCHAR(255)  NOT NULL,
        description VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL,
        "inventoryQuantity" INTEGER NOT NULL,
        category VARCHAR(255) NOT NULL,
        image TEXT,
        "isActive" BOOLEAN DEFAULT true
        );
    `)

    console.log('products done')

    await  client.query(`
        CREATE TABLE orders(
        id SERIAL PRIMARY KEY, 
        "userId" INTEGER REFERENCES users(id),
        "purchaseComplete" BOOLEAN DEFAULT false,
        "unitPrice" INTEGER,
        "productId" INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        "checkoutId" INTEGER      
        );
    `)

    console.log('orders done')

    await  client.query(`
        CREATE TABLE reviews(
        id SERIAL PRIMARY KEY, 
        "productId" INTEGER NOT NULL REFERENCES products(id),
        "userId" INTEGER NOT NULL REFERENCES users(id),
        message TEXT NOT NULL
        );
    `)
    
    console.log('reviews done')
    

    await  client.query(`
        CREATE TABLE checkouts(
        id SERIAL PRIMARY KEY, 
        "userId" INTEGER REFERENCES users(id),
        "firstName" VARCHAR(255) NOT NULL,
        "lastName" VARCHAR(255) NOT NULL,
        street VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        zip VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        "creditCardNumber" VARCHAR(255) NOT NULL,
        "creditCardExp" VARCHAR(255) NOT NULL,
        "creditValidationNumber" VARCHAR(255) NOT NULL,
        "paymentComplete" BOOLEAN DEFAULT true
        );
    `)

    console.log('Finished building tables')

  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function populateInitialData() {
  console.log('Starting to create users...');
  try {
    // users
    const usersToCreate = [
        { username: 'albert', password: 'bertie99', email:'albert@coffeemail.com' },
        { username: 'sandra', password: 'sandra123', email:'sandra@coffeemail.com' },
        { username: 'glamgal', password: 'glamgal123', email:'glamgal@coffeemail.com' },
        { username: 'pruplebarny', password: 'barney123', email:'barney@coffeemail.com' },
        { username: 'lauren', password: 'lauren123', email:'lauren@coffeemail.com', isAdmin:true },
    ];

    const users = await Promise.all(usersToCreate.map(createUser));
    console.log('Users created:');
    console.log(users);
    console.log('Finished creating users!');

    // Products
    console.log('Starting to create products...');
    const productsToCreate = [
        { title: 'Tall Coffee Ceramic Mug', description: 'Holds 20oz.  8in tall. porcelain', price:50, inventoryQuantity:100 , category:'mug' , image:'https://www.qualitylogoproducts.com/custom-mugs/tall-java-latte-black-mug16oz-hq-362181.jpg',isActive:true },
        { title: 'Short Coffee Ceramic Mug', description: 'Holds 10oz.  5in tall. Clay',  price: 35, inventoryQuantity:36 , category:'mug' , image:'https://m.media-amazon.com/images/I/61kli8LJpuL._AC_SL1500_.jpg', isActive:true },
        { title: 'Mickey Mouse Ceramic Mug', description: 'Holds 6.5oz.  4in tall. Clay',  price: 25, inventoryQuantity:0 , category:'mug' , image:undefined ,isActive:false},
        { title: 'Insulated Aluminum Tall Coffee Mug', description: 'Holds 20oz.  8in tall. Aluminum with clear plastic lid. No handle.',  price:50, inventoryQuantity:47 , category:'mug' ,image:'https://i5.walmartimages.com/asr/6840cfd9-7711-47aa-9296-317c66fb2e05.9db4105357a927a4fcf418c7e1c60095.jpeg', isActive:true },
        { title: 'Insulated Aluminum Short Coffee Mug With Handle', description: 'Holds 10oz.  5in tall. Aluminum with clear plastic lid. Ergonomic handle.', price:45, inventoryQuantity: 2947, category:'mug' , image:'https://m.media-amazon.com/images/I/61t33VYE4xL._AC_SX466_.jpg', isActive:true },
        { title: 'Coffee Mug Warmer', description: 'Black. 5 in wide. On/off button. 15in cord.' ,  price:10, inventoryQuantity:75 , category:'other' ,image:'https://images-na.ssl-images-amazon.com/images/I/51RHGluMOJS.__AC_SX300_SY300_QL70_FMwebp_.jpg', isActive:true },
        { title: 'Favorite Coffee Recipe Journal', description: 'Blank Journal for writing you favorite coffees to recreate later' ,  price:15, inventoryQuantity:23 , category:'other' ,image:'https://i2.wp.com/www.kindredfairtrade.com/wp-content/uploads/2018/10/Coffee-Tasting-Journal.jpg?fit=600%2C600&ssl=1', isActive:true },
        { title: 'Coffee Maker', description: 'Black, Make a carafe and single cup. Brews quickly',  price:90, inventoryQuantity:2 , category:'coffee maker' ,image:'https://i5.walmartimages.com/asr/38e9b2c4-2e4c-46a3-8852-7e117bde0bf4_1.28c1279dba5b83e57ddeb640bf718405.jpeg', isActive:true },
        { title: 'Single Mug Coffee Maker', description: 'Black, Make a single cup. Brews quickly' ,  price:40, inventoryQuantity:5 , category:'coffee maker' ,image:'https://m.media-amazon.com/images/I/71tybZyMkuL._AC_UL400_.jpg', isActive:true },
        { title: 'Coffee Pods', description: 'DonutShop Medium Blend. Box of 12' ,  price: 11, inventoryQuantity:4780 , category:'coffee' , image:'https://cdn.shopify.com/s/files/1/0271/1558/5622/products/BreakfastBlend_NewLidPod_1800x1800.jpg?v=1631301315', isActive:true },
        
        { title: 'Coffee Press', description: 'Glass and stanless cage and press.' ,  price: 42, inventoryQuantity:0 , category:'other' , image:undefined, isActive :false},
        { title: 'Cappuccino Wall Art', description: 'Print on Canvas, 30in x 46in', price: 67, inventoryQuantity:14, category:'wall art' , image:"https://tse3.mm.bing.net/th?id=OIP.ZnADjqwjlpAl2voTbFbyQwHaHa&pid=Api&P=0&w=300&h=300", isActive:true },
        { title: 'Coffee Botanical Sketch Art', description: 'Oil paint on canvas, 30in x 46in',  price: 190, inventoryQuantity:2 , category:'wall art' , image:'https://images.thdstatic.com/productImages/79aa2e4f-3939-45e8-b050-ca896153c7a1/svn/multi-posters-art-prints-2622916x20i2211-64_600.jpg', isActive:true},
        { title: 'Coffee Table', description: 'Mocha finish. 24in x 50in x 30in',  price:478, inventoryQuantity:18 , category:'furniture' ,image:'https://m.media-amazon.com/images/I/61q2QP1OZUL.jpg', isActive:true },
        { title: 'Coffee Bar', description: 'Reclaimed barn wood. 40in x 27in x 40in. 2 drawers and 2 shelves. Slate top.', price:350, inventoryQuantity: 27, category:'furniture', image:'https://mostlovelythings.com/wp-content/uploads/2019/01/coffee-bar-station-stone-top-open-shelving.jpg', isActive:true },
        { title: 'Coffee of the Month Subcription', description: '12 months. Your choice of roast delivered to your door every month. Sustainable and Fair farmed from all over the globe. Every subcription donates $2 per month to protect the culivation of the coffee bean in the changing global climate.' ,  price:200, inventoryQuantity:200 , category:'coffee' ,image:'https://comps.gograph.com/coffee-and-tea-in-bags_gg57268808.jpg', isActive:true },
        { title: 'Coffee and Mug + Gift Box', description: 'Your selection of roast. Includes mug, sweetner, 2 flavors of coffee and custom coasters' ,  price:39, inventoryQuantity:68 , category:'gift' ,image:'https://m.media-amazon.com/images/I/51EnWq6GOQL.jpg', isActive:true },
        ];

      
    const products = await Promise.all(productsToCreate.map(createProducts));
    console.log('Products created:');
    console.log(products);
    console.log('Finished creating Products!');

    // Orders
    console.log('starting to create orders...');
    const ordersToCreate = [
        { userId: 3, purchaseComplete: false, productId: 1, quantity:3 },
        { userId: 1, purchaseComplete: false, productId: 1, quantity:3 }, 
        { userId: 1, purchaseComplete: false, productId: 3, quantity:3 }, 
        { userId: 2, purchaseComplete: false, productId: 7, quantity:1 },
        { userId: 1, purchaseComplete: false, productId: 9, quantity:3 },
        { userId: 2, purchaseComplete: false, productId: 4, quantity:3 },
        { userId: 2, purchaseComplete: false, productId: 9, quantity:3 }, 
        { userId: 4, purchaseComplete: false, productId: 17, quantity:1 },       
        { userId: 4, purchaseComplete: false, productId: 16, quantity:1 }, 
        { userId: 4, purchaseComplete: false, productId: 13, quantity:1 }
    ];
    
    const orders = await Promise.all(ordersToCreate.map(createOrder));
    console.log('Orders Created: ', orders)
    console.log('Finished creating orders.')

    // Checkout
    console.log('starting to create checkouts...');
    const checkoutsToCreate = [
        { userId: 1, firstName: "Margret", lastName:'Bridger',street:"123 Walk St", city:"Atlanta", state:"GA",zip:"12345", creditCardNumber: '6789123456780987', creditCardExp:"09/30" , creditValidationNumber:"833", phone: '4445556678', orders: [ {orderId:2,price:40},{orderId:3,price:60},{orderId:4,price:23} ] },
        { userId: 2, firstName: "Daniel", lastName:'Flith',street:"678 Garbage Blvd", city:"Stink Town", state:"GA",zip:"54321", creditCardNumber: '3245673481981234', creditCardExp:"09/30" , creditValidationNumber:"833", phone: '3336669129', orders: [ {orderId:5,price:42},{orderId:6,price:30},{orderId:7,price:26} ] },
        { userId: 3, firstName: "Clam Aquatics", lastName:'Business',street:"734 Ocean Blvd", city:"Fish City", state:"GA",zip:"44321", creditCardNumber: '3245674780581234', creditCardExp:"09/30" , creditValidationNumber:"833", phone: '3336669129', orders: [ {orderId:1,price:90}] },
    ];

    const checkouts = await Promise.all(checkoutsToCreate.map(createCheckout));
    console.log('Checkouts Created: ', checkouts)
    console.log('Finished creating checkouts.')

    // Reviews
    console.log('starting to create reviews...');
    const reviewsToCreate = [
        { productId: 1, userId: 1, message:'Feels nice in my hands. Keeps coffee warm.' },
        { productId: 2, userId: 1, message:'This was a thoughtful gift. I think of the gift giver every morning!'},
        { productId: 3, userId: 2, message:'This is perfect for the Disney enthusiast.'},
        { productId: 4, userId: 2, message:'It is great for my morning commute. No spills.'},
        { productId: 5, userId: 1, message:'I like the security of the lid and the handle for walking around the office.' },
        { productId: 6, userId: 3, message:'Keeps my coffee warm all morning. Can make the mug a little hot to the touch.' },
        { productId: 7, userId: 3, message:'I love to write about different coffees I have tried during my travels. I hope to write a book with these notes.' },
        { productId: 8, userId: 3, message:'This brews plenty of coffee for my family.' },
        { productId: 9, userId: 2, message:'This smaller pot is great for tight spaces.' },
        { productId: 10, userId: 4, message:'Great flavor and easy to use.' },
        { productId: 11, userId: 4, message:'Durable and makes great flavored coffee. Great size for my 3 morning cups.' },
        { productId: 12, userId: 2, message:'Matches my decor.' },
        { productId: 13, userId: 4, message:'Looks great above my coffee bar in my kitchen.' },
        { productId: 15, userId: 2, message:'It is durable and great finish. I store all my living room extra items.' },
        { productId: 17, userId: 4, message:'Great flavor, every month. I plan to buy another next year.' },
        { productId: 10, userId: 2, message:'Just the right size and consistent' },
    ];
    const reviews = await Promise.all(reviewsToCreate.map(createReview));
    console.log('Reviews Created: ', reviews)
    console.log('Finished creating reviews.')

  } catch (error) {
    console.error("Error building tables!", error)
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
