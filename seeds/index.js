const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { toLocaleString } = require('./cities');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');


mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('the database is connected');
});

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
   for (let i = 0; i <50; i++) {
       const randomCitie = Math.floor(Math.random()*1000);
       const price = Math.floor(Math.random()*1000)+100;
       const campSeed = new Campground({
           location: `${cities[randomCitie].city},${cities[randomCitie].state}`,
           titel: `${sample(places)} ${sample(descriptors)}`,
           image: 'https://source.unsplash.com/collection/9046717/',
           description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reiciendis cumque, ipsum ea modi distinctio molestias aut ullam commodi libero mollitia eveniet itaque ipsam repellendus consequatur ut iure nam alias totam.`,
           price: `${price}`
       })
       await campSeed.save();
   }
}

seedDB()
.then (() => {
    mongoose.connection.close();
})