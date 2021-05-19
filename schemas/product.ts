export interface ProductSchema {
    _id: { $oid: string };
    title: string;
    description: string;
    image: string;
    price: number;
}
