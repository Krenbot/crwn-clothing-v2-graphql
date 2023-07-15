import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client'

import ProductCard from '../../components/product-card/product-card.component';
import Spinner from '../../components/spinner/spinner.component';

import { CategoryContainer, Title } from './category.styles';

const GET_CATEGORY = gql`
  query($title: String!){
    getCollectionByTitle(title: $title){
      id
      title
      items{
        id
        name
        price
        imageUrl
      }
    }
  }
`

const Category = () => {
  const { category } = useParams();

  const { loading, error, data } = useQuery(GET_CATEGORY, {
    variables: {
      title: category,
    }
  });

  useEffect(() => {
    if (data) {
      const {
        getCollectionsByTitle: { items }
      } = data;
      setProducts(items);
    }
  }, [category, data])

  const [products, setProducts] = useState([]);

  return (
    <>
      {
        loading ? (
          <Spinner />
        ) : (
          <>
            <Title>{category.toUpperCase()}</Title>
            <CategoryContainer>
              {products &&
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </CategoryContainer>
          </>
        )}
    </>
  );
};

export default Category;
