import { Author } from '../common/interfaces';

export const getAuthors = (): Promise<Author[]> => {
  return fetch(`${process.env.REACT_APP_API}/authors`).then((response) => (response.json() as unknown) as Author[]);
};

export async function getAuthorByName(authorName: string): Promise<Author> {
  return fetch(`${process.env.REACT_APP_API}/authors?name=${authorName}`)
    .then((response) => response.json())
    .then((data) => data[0]);
}

export async function editAuthor(authorId: number, partialUpdate: Partial<Author>): Promise<any> {
  return fetch(`${process.env.REACT_APP_API}/authors/${authorId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(partialUpdate),
  }).then((response) => response.json());
}
