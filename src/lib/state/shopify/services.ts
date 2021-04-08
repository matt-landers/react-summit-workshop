import Client from 'shopify-buy';

const client = Client.buildClient({
  domain: 'devrel.myshopify.com',
  storefrontAccessToken: 'b93aba823553b27aee2c51744caf0cf1',
});

export type Product = Pick<
  ShopifyBuy.Product,
  'id' | 'title' | 'description' | 'onlineStoreUrl' | 'images' | 'variants'
> & { handle: string };

export type Products = Product[];

function transformProduct(product: ShopifyBuy.Product) {
  return {
    id: product.id,
    images: product.images,
    title: product.title,
    description: product.description,
    onlineStoreUrl: product.onlineStoreUrl,
    variants: product.variants,
    handle: (product as any).handle as string,
  };
}

async function allProducts(): Promise<Products> {
  const products = await client.product.fetchAll();
  return products.map((product) => transformProduct(product));
}

async function getCheckoutId(): Promise<string> {
  if (localStorage.getItem('checkoutId')) {
    return localStorage.getItem('checkoutId') ?? '';
  }
  const checkout = await client.checkout.create();
  localStorage.setItem('checkoutId', checkout.id as string);
  return checkout.id as string;
}

async function addProduct(variantId: string) {
  await client.checkout.addLineItems(await getCheckoutId(), [
    { variantId, quantity: 1 },
  ]);
}

async function removeProduct(variantId: string) {
  await client.checkout.removeLineItems(await getCheckoutId(), [variantId]);
}

async function getCheckout(): Promise<Client.Cart> {
  const checkout = await client.checkout.fetch(await getCheckoutId());
  return checkout;
}

async function getProduct(handle: string): Promise<Product> {
  const product = await client.product.fetchByHandle(handle);
  return transformProduct(product);
}

async function getProductsByCollection(handle: string): Promise<Products> {
  const collection = await client.collection.fetchByHandle(handle);

  /* eslint-disable-next-line @typescript-eslint/no-unsafe-call */
  return (collection as any).products.map((product: ShopifyBuy.Product) =>
    transformProduct(product),
  ) as Products;
}

export default {
  allProducts,
  addProduct,
  removeProduct,
  getCheckout,
  getProduct,
  getProductsByCollection,
};
