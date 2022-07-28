import { productQueryFirstTen, updateProductPrice } from "./queries/queries.js";
import {
  returnRawQueryData,
  returnDataFromProductEdges,
  getProductEdges,
  updateProductPriceFromProdcuctArray,
} from "./helpers/helpers.js";

async function main() {
  // request product data from Shopify
  const res = await returnRawQueryData(productQueryFirstTen);

  // process the product data
  const productEdgesDataArray = returnDataFromProductEdges(
    getProductEdges(res)
  );

  console.log("Query result :", productEdgesDataArray.length);
  // Run function to make calls to Shopify in a rate limited manner
  await updateProductPriceFromProdcuctArray(
    productEdgesDataArray,
    updateProductPrice
  );
}
main();
