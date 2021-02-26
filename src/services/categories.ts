import { Category } from '../common/interfaces';

export const getCategories = (): Promise<Category[]> => {
  return fetch(`${process.env.REACT_APP_API}/categories`).then((response) => (response.json() as unknown) as Category[]);
};

export async function getCategoryIdsByNames(categoryNames: Array<string>): Promise<Array<number>> {
  return Promise.all(categoryNames.map((categoryName) => getCategoryIdByName(categoryName)));
}

async function getCategoryIdByName(categoryName: string): Promise<number> {
  return fetch(`${process.env.REACT_APP_API}/categories?name=${categoryName}`)
    .then((response) => response.json())
    .then((data) => data[0].id);
}
