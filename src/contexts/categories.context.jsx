import { createContext, useState, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client'

export const CategoriesContext = createContext({
  categoriesMap: {},
});

const COLLECTIONS = gql`
query GetCollections{
  collections{
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

const SET_CATEGORY = gql`
  mutation($category: Category!){
    addCategory(category: $category){
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

export const CategoriesProvider = ({ children }) => {
  const { loading, error, data } = useQuery(COLLECTIONS);
  const [categoriesMap, setCategoriesMap] = useState({});

  const [addCategory, { loading, error, data }] = useMutation(SET_CATEGORY)

  addCategory({ variables: { category: categoryObject } })

  useEffect(() => {
    if (data) {
      const { collections } = data;
      const collectionsMap = collections.reduce((acc, collection) => {
        const { title, items } = collection;
        acc[title.toLowerCase()] = items;
        return acc;
      }, {})
      setCategoriesMap(collectionsMap);
    }
  }, [data])

  const value = { categoriesMap, loading };
  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
