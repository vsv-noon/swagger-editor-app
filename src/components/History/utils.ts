export const parseObjectKeys = ([key, value]: [string, string]) => {
  const splitKey = key.split(/(?=[A-Z])/);
  const newKey = splitKey.map((word) => word.toLocaleLowerCase()).join('');
  return [newKey, value];
};
