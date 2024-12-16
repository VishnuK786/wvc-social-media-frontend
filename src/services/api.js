import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getFiles = async (dataType) => {
  const response = await api.get(`/get_files?data_type=${dataType}`);
  return response.data;
};

export const generateBlog = async (blogTopic, folderName, fileName) => {
  const response = await api.post('/generate_blog', {
    blog_topic: blogTopic,
    folder_name: folderName,
    file_name: fileName
  });
  return response.data;
};

export const generateImage = async (query) => {
  const response = await api.get(`/image-query/highest-quality-image?query=${encodeURIComponent(query)}`);
  return response.data.top_images.map(img => ({
    url: img.image_url,
    description: img.description
  }));
};

export const generateInstagramContent = async (blogTopic, folderName, fileName) => {
  const response = await api.post('/generate_instagram', {
    blog_topic: blogTopic,
    folder_name: folderName,
    file_name: fileName
  });
  return response.data;
};

export const generateLinkedInContent = async (blogTopic, folderName, fileName) => {
  const response = await api.post('/generate_linkedin', {
    blog_topic: blogTopic,
    folder_name: folderName,
    file_name: fileName
  });
  return response.data;
};

export const fetchLoadChromaPost = async (folderName,fileName) => {
  const response = await api.post('/load_chroma', {
    folder_name: folderName,
    file_name: fileName
  });
  return response.data;
};

export const postLinkedInPost = async (content,imageUrl) => {
  const splitedBase64 = imageUrl ? imageUrl.map((e)=>{
    return e.url
  }):[]
  const response = await api.post('/post_to_linkedin', {
    content: content,
    images: splitedBase64
  });
  return response.data;
};