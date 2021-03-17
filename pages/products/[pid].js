import React from 'react';
import path from 'path';
import fs from 'fs/promises';

function ProductDetailPage(props) {
  const { loadedProduct } = props;

  if (!loadedProduct) {
    return <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </React.Fragment>
  );
}

async function getData() {
  const fillePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(fillePath);
  const data = JSON.parse(jsonData);

  return data;
}

export async function getStaticProps(context) {
  const { params } = context;

  const productsId = params.pid;

  const data = await getData();

  const products = data.products.find((product) => product.id === productsId);

  if (!products) {
    return { notFound: true };
  }

  return {
    props: {
      loadedProduct: products,
    },
  };
}

export async function getStaticPaths() {
  const data = await getData();

  const ids = data.products.map((product) => product.id);

  const pathsWithParams = ids.map((id) => ({ params: { pid: id } }));

  return {
    paths: pathsWithParams,
    fallback: false,
  };
}

export default ProductDetailPage;
