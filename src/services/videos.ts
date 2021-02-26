import { getCategories, getCategoryIdsByNames } from './categories';
import { getAuthors, getAuthorByName, editAuthor } from './authors';
import { Author, Category, Video, Formats, ProcessedVideo } from '../common/interfaces';

interface VideoForm {
  name: string;
  author: string;
  categories: Array<string>;
  formats: Formats;
}

export const getVideos = (): Promise<any> => {
  return Promise.all([getCategories(), getAuthors()]).then(([categories, authors]: [Array<Category>, Array<Author>]) => {
    return authors
      .reduce((accum: any, author: Author) => {
        return [...accum, author.videos.map((video) => mapVideoToProcessedVideo(video, categories, author))];
      }, [])
      .flat();
  });
};

export const getAuthorAndCategoryIdsFromVideoForm = async (video: VideoForm): Promise<[Author, Array<number>]> => {
  const authorName = video.author;
  const categoryNames = video.categories;
  const [author, categoryIds]: [Author, Array<number>] = await Promise.all([
    getAuthorByName(authorName),
    getCategoryIdsByNames(categoryNames),
  ]);
  return [author, categoryIds];
};

export const createVideo = async (video: VideoForm): Promise<any> => {
  const [author, categoryIds]: [Author, Array<number>] = await getAuthorAndCategoryIdsFromVideoForm(video);
  const newVideo = { id: Math.random(), name: video.name, catIds: categoryIds, formats: video.formats, releaseDate: Date.now() };

  const partialUpdate = {
    videos: [...author.videos, newVideo],
  };
  return editAuthor(author.id, partialUpdate);
};

export const editVideo = async (videoId: number, video: VideoForm): Promise<any> => {
  const [author, categoryIds]: [Author, Array<number>] = await getAuthorAndCategoryIdsFromVideoForm(video);
  const partialUpdate = {
    videos: author.videos.map((v) => {
      if (v.id === Number(videoId)) {
        return { ...v, name: video.name, catIds: categoryIds };
      } else {
        return v;
      }
    }),
  };
  return editAuthor(author.id, partialUpdate);
};

export const deleteVideo = async (video: ProcessedVideo): Promise<any> => {
  const author: Author = await getAuthorByName(video.author);
  const partialUpdate = {
    videos: author.videos.filter((v) => v.id !== video.id),
  };
  return editAuthor(author.id, partialUpdate);
};

function getCategoryNameById(categories: Array<Category>, catId: number): string {
  return categories[catId - 1].name;
  // return categories.find((category: Category) => category.id === catId).name
}

function mapVideoToProcessedVideo(
  { catIds, formats, releaseDate, ...rest }: Video,
  categories: Array<Category>,
  author: Author
): ProcessedVideo {
  return {
    ...rest,
    categories: catIds.map((catId) => getCategoryNameById(categories, catId)).join(', '),
    highestQualityFormat: getHighestQualityFormat(formats),
    author: author.name,
    releaseDate: new Date(releaseDate).toDateString(),
  };
}

function getHighestQualityFormat(formats: Formats): string {
  const highestSize = Math.max.apply(
    null,
    Object.keys(formats).map((key) => formats[key].size)
  );
  const formatWithHighestSize: string = Object.keys(formats).find((key) => formats[key].size === highestSize) || Object.keys(formats)[0];
  return `${formatWithHighestSize} ${formats[formatWithHighestSize].res}`;
}
