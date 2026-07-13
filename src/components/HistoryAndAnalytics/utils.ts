import { HistoryResponse } from './HistoryAndAnalytics';

export const parseObjectKeys = ([key, value]: [string, string]): [
  string,
  string,
] => {
  if (key === 'URL') {
    return [key, value];
  }
  const splitKey = key.split(/(?=[A-Z])/);
  const newKey = splitKey.map((word) => word.toLocaleLowerCase()).join(' ');
  return [newKey, value];
};

export const trimUrl = (url: string): string => {
  const newUrl = url.split('/')[2];
  return newUrl;
};

export const sortByTimestamp = (history: HistoryResponse[]) => {
  const sortedArray = history.sort((a, b) => {
    return Date.parse(b.requestTimestamp) - Date.parse(a.requestTimestamp);
  });

  return sortedArray;
};
