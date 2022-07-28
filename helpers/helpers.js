import envVars from "../exportEnv.js";
import { Headers } from "cross-fetch";
import { GraphQLClient } from "graphql-request";
import { ApiVersion } from "@shopify/shopify-api";
const { API_KEY, API_SECRET_KEY, SHOP, SCOPES, SHOPIFY_ACCESS_TOKEN } = envVars;
console.log("The credntials user are for:", SHOP);
const endpoint = `https://${SHOP}/admin/api/${ApiVersion.April22}/graphql.json`;
// Make node behave like the browser???
globalThis.Headers = global.Headers || Headers;

let availableRateLimit;
let numberOfParallelRequests = 9;
const rateLimitThreshold = 988;
export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
  },
});

export const returnQueryData = async (query, variables = undefined) => {
  try {
    const queryData = await graphqlClient.request(query, variables);

    const returnData = JSON.stringify(queryData, undefined, 2);
    console.log(returnData);
    return returnData;
  } catch (error) {
    console.log("Query error :", error);
  }
};

export const returnRawQueryData = async (query, variables = undefined) => {
  try {
    const { errors, data, extensions, headers, status } =
      await graphqlClient.rawRequest(query, variables);
    availableRateLimit = extensions.cost.throttleStatus.currentlyAvailable;
    console.log(
      `Extension info ${extensions.cost.throttleStatus.currentlyAvailable} rate limit points`
    );
    const returnData = JSON.stringify(data, undefined, 2);
    console.log(returnData);
    return returnData;
  } catch (error) {
    console.log("Query error :", error);
  }
};

export const getProductEdges = (data) => {
  const parsedData = JSON.parse(data);
  return parsedData.products.edges;
};

export const returnDataFromProductEdges = (edgesArray) => {
  let returnArray = [];
  for (let edge = 0; edge < edgesArray.length; edge++) {
    const productId = edgesArray[edge].node.id;
    const variantId = edgesArray[edge].node.variants.edges[0].node.id;
    const variantWeight = edgesArray[edge].node.variants.edges[0].node.weight;
    returnArray.push({
      productId,
      variantId,
      variantWeight,
    });
  }
  return returnArray;
};

export const updatePrice = (Math.random() * 250).toFixed(2);

export const productInput = (productId, variantId) => {
  return {
    input: {
      id: productId,
      variants: [
        {
          id: variantId,
          price: updatePrice,
        },
      ],
    },
  };
};

export const updateProductPriceFromProdcuctArray = async (
  productArray,
  query
) => {
  for (let prod = 0; prod < productArray.length; prod++) {
    const { productId, variantId } = productArray[prod];
    const variableInput = productInput(productId, variantId);
    if (prod % numberOfParallelRequests == 0) {
      const result = await returnRawQueryData(query, variableInput);
    } else {
      returnRawQueryData(query, variableInput);
    }

    if (availableRateLimit < rateLimitThreshold) {
      console.log("Not enough rate limit points - waiting 2 seconds ....");
      await new Promise((reslove) => {
        setTimeout(() => {
          console.log("Done waiting - continuing requests");
          reslove("Rate limit wait");
        }, 2000);
      });
    }
  }
};
