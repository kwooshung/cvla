import get from '../get/all';

const exists = async (tag: string): Promise<boolean> => {
  const tags = await get();
  return tags.includes(tag);
};

export default exists;
