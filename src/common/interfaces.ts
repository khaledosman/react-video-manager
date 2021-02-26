export interface Category {
  id: number;
  name: string;
}

export interface Formats {
  [key: string]: Format;
}

export interface Format {
  res: string;
  size: number;
}

export interface Video {
  id: number;
  catIds: number[];
  name: string;
  formats: Formats;
  releaseDate: Date | number;
}

export interface Author {
  id: number;
  name: string;
  videos: Video[];
}

export interface ProcessedVideo {
  id: number;
  name: string;
  author: string;
  categories: string;
  highestQualityFormat: string;
  releaseDate?: string;
}
