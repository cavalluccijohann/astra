import AsyncStorage from "@react-native-async-storage/async-storage";

export const emailValidator = (email: string) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'Email cannot be empty.';
  if (!re.test(email)) return 'Ooops! We need a valid email address.';

  return '';
};

export const passwordValidator = (password: string) => {
  if (!password || password.length <= 0) return 'Password cannot be empty.';

  return '';
};

export const nameValidator = (name: string) => {
  if (!name || name.length <= 0) return 'Name cannot be empty.';

  return '';
};

export async function $fetch<T>(method: string, endpoint: string, body?: any): Promise<T> {
  const userToken = await AsyncStorage.getItem('authToken');
  const url = `http://172.20.10.2:3000/${endpoint}`;
  const requestOptions = {
    method,
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    },
    body: body ? body : undefined,
  };

  const response = await fetch(url, requestOptions);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}
