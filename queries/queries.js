import { gql } from "graphql-request";


export const productQueryFirstTen = gql`
  query ProductsFirstTen {
    products(first: 10) {
      edges {
        node {
          id
          variants(first: 1) {
            edges {
              node {
                id
                weight
              }
            }
          }
        }
      }
    }
  }
`;

export const updateProductPrice = gql`
  mutation productPriceUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;
