import axiosClient from "./axiosClient";

export interface ExtraItemInput {
  menuItemId?: string;
  name: string;
  qty: number;
  price: number;
}

export interface ExtraRecord {
  id: string;
  userId: string;
  subscriptionId?: string;
  date: string;
  shift: "morning" | "evening" | "night";
  totalExtra: number;
  paid: boolean;
}

export const createExtrasApi = async (payload: {
  userId: string;
  subscriptionId?: string;
  date: string;
  shift: "morning" | "evening" | "night";
  items: ExtraItemInput[];
}) => {
  const response = await axiosClient.post<ExtraRecord>("/extras", payload);
  const item = response.data as ExtraRecord & { _id?: string };
  return {
    ...item,
    id: item._id ?? item.id,
  };
};

export const fetchExtrasByUser = async (userId: string) => {
  const response = await axiosClient.get<ExtraRecord[]>(`/extras/${userId}`);
  return response.data.map((item) => {
    const record = item as ExtraRecord & { _id?: string };
    return {
      ...record,
      id: record._id ?? record.id,
    };
  });
};
