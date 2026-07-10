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
