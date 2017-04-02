/**
 * Created by sean_ryall on 2017-03-30.
 */

var faker = require('faker');
function generateReviews () {
    var reviews = [];
    for (var id = 0; id < 20; id++) {
        var userId = faker.random.number(100);
        var beerBrand = faker.lorem.words();
        var review = faker.lorem.paragraph();
        var numStars = faker.random.number({min:1, max:5});

        posts.push({
            "userId": userId,
            "beerBrand": beerBrand,
            "review": review,
            "id": id,
            "numStars":numStars
        })
    }
    return { "reviews": reviews }
}
module.exports = generateBlogs;
