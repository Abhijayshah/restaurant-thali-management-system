import axiosClient from "./axiosClient";

export interface SubscriptionSummary {
  id: string;
  userId: string;
  month: string;
  shifts: string[];
  totalAmount: number;
  amountPaid: number;
  paymentStatus: string;
  paymentMethod?: string;
  paymentRef?: string;
  approvedByOwner: boolean;
}

export const fetchSubscriptions = async () => {
  const response = await axiosClient.get<SubscriptionSummary[]>("/subscriptions");
  return response.data.map((item) => normalizeSubscription(item));
};

export const fetchSubscriptionsForUser = async (userId: string) => {
  const response = await axiosClient.get<SubscriptionSummary[]>(
    `/subscriptions/${userId}`
  );
  return response.data.map((item) => normalizeSubscription(item));
};

export const createSubscriptionApi = async (payload: {
  userId: string;
  month: string;
  shifts: string[];
}) => {
  const response = await axiosClient.post<SubscriptionSummary>(
    "/subscriptions",
    {
      userId: payload.userId,
      month: payload.month,
      shifts: payload.shifts,
    }
  );

  return normalizeSubscription(response.data);
};

export const markSubscriptionPaidApi = async (
  id: string,
  amountPaid: number
) => {
  const response = await axiosClient.put<SubscriptionSummary>(
    `/subscriptions/${id}/pay`,
    { amountPaid }
  );
  return normalizeSubscription(response.data);
};

const normalizeSubscription = (
  item: SubscriptionSummary & { _id?: string }
): SubscriptionSummary => ({
  id: item._id ?? item.id,
  userId: item.userId,
  month: item.month,
  shifts: item.shifts,
  totalAmount: item.totalAmount,
  amountPaid: item.amountPaid,
  paymentStatus: item.paymentStatus,
  paymentMethod: item.paymentMethod,
  paymentRef: item.paymentRef,
  approvedByOwner: item.approvedByOwner,
});
