import axiosClient from "./axiosClient";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

export const fetchMenu = async () => {
  const response = await axiosClient.get<MenuItem[]>("/menu");
  return response.data.map((item) => ({
    ...item,
    id: (item as MenuItem & { _id?: string })._id ?? item.id,
  }));
};

