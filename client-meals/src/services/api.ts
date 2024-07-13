import axios from "axios"

const apiClient = axios.create({
    baseURL: "http://localhost:3000",
});

export const get = async (endpoint: string) => {
    const response = await apiClient.get(endpoint);
    return  response.data
};

export const post = async (endpoint: string, data:any  ) => {
    return await apiClient.post(endpoint, data)
};

export const put = async (endpoint: string, data:any  ) => {
    return await apiClient.put(endpoint, data)
};

export const deleteApi = async (endpoint: string) => {
    return await apiClient.delete(endpoint)
};



export async function fetchPosts() {
    const response = await fetch('http://localhost:3000/item');
    return response.json()
  }
  
  export async function fetchPost(id:any) {
    const response = await fetch(`http://localhost:3000/posts/${id}`);
    return response.json()
  }
  
  export async function createPost(newPost:any) {
    const response = await fetch(`http://localhost:3000/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPost)
    });
    return response.json()
  }
  
  export async function updatePost(updatedPost:any) {
    const response = await fetch(`http://localhost:3000/posts/${updatedPost.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedPost)
    });
    return response.json()
  }
  
  export async function deletePost(id:any) {
    const response = await fetch(`http://localhost:3000/posts/${id}`, {
      method: "DELETE",
    });
    return response.json()
  }