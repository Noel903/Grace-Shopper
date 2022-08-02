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
        { username: 'albert', password: 'bertie99', email:'albert@carsalesmail.com' },
        { username: 'sandra', password: 'sandra123', email:'sandra@carsalesmail.com' },
        { username: 'glamgal', password: 'glamgal123', email:'glamgal@carsalesmail.com' },
        { username: 'pruplebarny', password: 'barney123', email:'barney@carsalesmail.com' },
        { username: 'lauren', password: 'lauren123', email:'lauren@carsalesmail.com', isAdmin:true },
    ];

    const users = await Promise.all(usersToCreate.map(createUser));
    console.log('Users created:');
    console.log(users);
    console.log('Finished creating users!');

    // Products
    console.log('Starting to create products...');
    const productsToCreate = [
        { title: 'GMC Sierra 2022', description: 'AT4 model, Sand dune color', price:50000, inventoryQuantity:10 , category:'Trucks' , image:'https://gmauthority.com/blog/wp-content/uploads/2022/03/2022-GMC-Sierra-1500-Desert-Sand-Metallic-GTL-001.jpg',isActive:true },
        { title: 'Ford Raptor 2022', description: 'Raptor blue, can jump hills',  price: 75000, inventoryQuantity:11 , category:'Trucks' , image:'https://hips.hearstapps.com/hmg-prod/images/2021-ford-f-150-raptor-133-1637342008.jpg?crop=0.681xw:0.765xh;0.264xw,0.235xh&resize=768:*', isActive:true },
        { title: 'Ram TRX', description: 'Red, Supercharged with 700HP',  price: 80000, inventoryQuantity:5 , category:'Trucks' , image:'https://www.ramtrucks.com/content/dam/fca-brands/na/ramtrucks/en_us/2022/trx/gallery/trx-gallery-019.jpg.image.1440.jpg' ,isActive:true},
        { title: 'Toyota Tundra TRD PRO 2022', description: 'Death Black, 6in lift, 4 door for more girls.',  price:66000, inventoryQuantity:7 , category:'Trucks' ,image:'https://www.turbotundras.com/attachments/2022-lifted-tundra-jpg.67/', isActive:true },
        { title: 'Nissan Titan Cummins', description: 'Black on Black, Lifted with -13 wheel offset, ready for the dunes', price:45000, inventoryQuantity: 9, category:'Trucks' , image:'https://images.customwheeloffset.com/web/1273776-1-2017-titan-xd-nissan-rough-country-suspension-lift-6in-hostile-sprocket-matte-black.jpg', isActive:true },
        { title: 'Chevrolet ZR2 2022', description: 'Stormtropper White, 6.2L direct injectin engine.' ,  price:22, inventoryQuantity:51000 , category:'Trucks' ,image:'https://www.thedrive.com/uploads/2022/04/12/Silverado-ZR2-Hero.jpg?auto=webp', isActive:true },
        { title: 'Chevrolet Colorado ZR2', description: 'Sanddune, DSV Multimatic Shocks, Ready to jump off a cliff and still run' ,  price:49000, inventoryQuantity:23 , category:'Trucks' ,image:'https://cdn.jdpower.com/jdp_2022%20chevrolet%20colorado%20zr2%20front%20quarter%20view.jpg', isActive:true },
        { title: 'Toyota Tacoma TRD PRO', description: 'Hulk Green, Snurkel for Hurrican wheater, ready for your next sneaky link',  price:45000, inventoryQuantity:13 , category:'Trucks' ,image:'https://www.motorbiscuit.com/wp-content/uploads/2020/08/20_Tacoma_TRD_Pro_Army_Green_1.jpg', isActive:true },
        { title: 'Chevrolet Camaro ZL1', description: 'Stromtropper White, Ready for the track, carbon ceramic brakes.' ,  price:65000, inventoryQuantity:5 , category:'Cars' ,image:'https://cdn1.mecum.com/auctions/nc0420/nc0420-409567/images/1-1583170284544@2x.jpg?1592587962000', isActive:true },
        { title: 'Ford GT500 Mustang', description: 'Gray, 5.2L Supercharged flat crank engine with a roar louder than Ferrari' ,  price: 4, inventoryQuantity:101000 , category:'Cars' , image:'https://hips.hearstapps.com/hmg-prod/images/2022-ford-mustang-shelby-gt500-02-1636734552.jpg', isActive:true },
        
        { title: 'Dodge Challenger Hellcat Redeye', description: 'Gray, 6.2L Supercharged with 800 HP, ready do burn off those tires.' ,  price: 85000, inventoryQuantity:6 , category:'Cars' , image:'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/2019-dodge-challenger-srt-hellcat-redeye-widebody-placement-1530137519.jpg?crop=1.00xw:0.822xh;0,0.0499xh&resize=1200:*', isActive :true},
        { title: 'Dodge Charger Hellcat Widebody', description: 'Thunder Blue, 6.2L Supercharged, enough room for the family to do doughnuts', price: 67000, inventoryQuantity:14, category:'Cars' , image:"https://www.motortrend.com/uploads/sites/11/2019/06/2020-Dodge-Charger-SRT-Hellcat-Widebody-12.jpg?fit=around%7C875:492", isActive:true },
        { title: 'Toyota Supra MK5', description: 'Gun Metal Gray, 2 Door Coupe, inline 6 cylinder, good MPG',  price: 79000, inventoryQuantity:6 , category:'Cars' , image:'https://www.motortrend.com/uploads/sites/5/2021/02/2021-Toyota-GR-Supra-3-0-Premium-26.jpg', isActive:true},
        { title: 'Chevrolet Corvette Z06', description: 'Orange, Midengine all american foreign car killer.',  price:110000, inventoryQuantity:2 , category:'Cars' ,image:'https://media.architecturaldigest.com/photos/61785a7e983eba1f38a08f5e/master/pass/2023-Chevrolet-Corvette-Z06-003.jpg', isActive:true },
        { title: 'Ford GT', description: 'White, Carbonfiber hood, rare only 400 made !', price:200000, inventoryQuantity: 1, category:'Cars', image:'https://hips.hearstapps.com/hmg-prod/images/2022-ford-gt-heritage-edition-110-1628777666.jpg?crop=0.893xw:1.00xh;0.0545xw,0&resize=640:*', isActive:true },
        { title: 'Dodge Viper', description: 'Black, Discontinued sports car from Dodge. Naturually aspirated v10 engine with tons of power. Slightly used.' ,  price:150000, inventoryQuantity:1 , category:'Cars' ,image:'https://cdn.motor1.com/images/mgl/rlmQV/s1/2016-dodge-viper-acr.jpg', isActive:true },
        { title: 'Lambo Truck (URUS)', description: 'Barney Purple, Lamborghini Urus, insanly fast for a SUV, currently owned by one our Devs. Make her an offer' ,  price:400000, inventoryQuantity:1 , category:'Trucks' ,image:'https://www.carscoops.com/wp-content/uploads/2022/06/2022-Lamborghini-Urus-21.jpg', isActive:true },
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
        { userId: 1, firstName: "Margret", lastName:'Bridger',street:"123 Walk St", city:"Atlanta", state:"TX",zip:"12345", creditCardNumber: '6789123456780987', creditCardExp:"09/30" , creditValidationNumber:"833", phone: '4445556678', orders: [ {orderId:2,price:40},{orderId:3,price:60},{orderId:4,price:23} ] },
        { userId: 2, firstName: "Daniel", lastName:'Flith',street:"678 Garbage Blvd", city:"Stink Town", state:"TX",zip:"54321", creditCardNumber: '3245673481981234', creditCardExp:"09/30" , creditValidationNumber:"833", phone: '3336669129', orders: [ {orderId:5,price:42},{orderId:6,price:30},{orderId:7,price:26} ] },
        { userId: 3, firstName: "Clam Aquatics", lastName:'Business',street:"734 Ocean Blvd", city:"Fish City", state:"TX",zip:"44321", creditCardNumber: '3245674780581234', creditCardExp:"09/30" , creditValidationNumber:"833", phone: '3336669129', orders: [ {orderId:1,price:90}] },
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
