import Client from 'shopify-buy';

const client = Client.buildClient({
  domain: 'devrel.myshopify.com',
  storefrontAccessToken: 'b93aba823553b27aee2c51744caf0cf1',
});

export interface ProductImage {
  src: string;
}

export interface Product {
  id: string | number;
  title: string;
  description: string;
  onlineStoreUrl?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  handle: string;
}

export interface ProductVariant {
  id: string | number;
  image?: ProductImage;
  product?: Pick<Product, 'handle'>;
}

export type Products = Product[];

export interface CartLineItem {
  id: string | number;
  title: string;
  quantity: number;
  variant: ProductVariant;
}

export interface Cart {
  id: string | number;
  webUrl: string;
  lineItems: CartLineItem[];
}

function transformProductVariant(
  variant: ShopifyBuy.ProductVariant,
): ProductVariant {
  return {
    id: variant.id,
    image: { src: variant.image?.src },
    product: { handle: (variant as any).product?.handle as string },
  };
}

function transformProduct(product: ShopifyBuy.Product): Product {
  return {
    id: product.id,
    images: product.images,
    title: product.title,
    description: product.description,
    onlineStoreUrl: product.onlineStoreUrl,
    variants: product.variants.map(transformProductVariant),
    handle: (product as any).handle as string,
  };
}

function transformCart(cart: ShopifyBuy.Cart): Cart {
  return {
    id: cart.id,
    webUrl: ((cart as any) as { webUrl: string }).webUrl,
    lineItems: cart.lineItems.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      variant: transformProductVariant(
        (item as any).variant as ShopifyBuy.ProductVariant,
      ),
    })) as CartLineItem[],
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

async function getCheckout(): Promise<Cart> {
  const checkout = await client.checkout.fetch(await getCheckoutId());
  return transformCart(checkout);
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
