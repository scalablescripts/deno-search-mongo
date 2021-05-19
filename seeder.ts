import {db} from "./database/connection.ts";
import {ProductSchema} from "./schemas/product.ts";
import {faker} from "https://deno.land/x/deno_faker@v1.0.3/mod.ts";

const products = db.collection<ProductSchema>("products");

const list = [];

for (let i = 0; i < 50; i++) {
    list.push({
        title: faker.lorem.words(2),
        description: faker.lorem.words(10),
        image: faker.image.imageUrl(),
        price: faker.random.number(100),
    })
}

await products.insertMany(list);
