import {Application, Router, RouterContext} from "https://deno.land/x/oak/mod.ts";
import {oakCors} from 'https://deno.land/x/cors@v1.2.1/mod.ts';
import {db} from "./database/connection.ts";
import {ProductSchema} from "./schemas/product.ts";


const app = new Application();
const router = new Router();

const products = db.collection<ProductSchema>("products");

app.use(oakCors({
    origin: /^.+localhost:(3000|4200|8080)$/,
}))

router.get('/api/products/frontend', async ({response}: RouterContext) => {
    response.body = await products.find().toArray();
})

router.get('/api/products/backend', async ({request, response}: RouterContext) => {
    let options = {}
    let findOptions = {}

    const s = request.url.searchParams.get('s') || '';

    if (s) {
        options = {
            $or: [
                {title: new RegExp(s.toString(), 'i')},
                {description: new RegExp(s.toString(), 'i')},
            ]
        }
    }

    const sort = request.url.searchParams.get('sort') || '';

    if (sort) {
        findOptions = {
            sort: {
                price: sort.toString().toLowerCase() == 'asc' ? 1 : -1
            }
        }
    }

    const page: number = parseInt(request.url.searchParams.get('page') as any) || 1;
    const perPage = 9;
    const total = await products.count(options)

    response.body = {
        data: await products.find(options, findOptions).limit(perPage).skip((page - 1) * perPage).toArray(),
        total,
        page,
        last_page: Math.ceil(total / perPage)
    };
})

app.use(router.routes());
app.use(router.allowedMethods());

console.log('listening to port 8000!')
await app.listen({port: 8000});
