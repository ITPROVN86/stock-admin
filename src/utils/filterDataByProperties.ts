import { BannerEvent } from "../apis/banners.api";
import { Contest } from "../apis/contests.api";
import { OrderInfo, OrderMatch } from "../apis/orders.api";
import { UserInfo } from "../apis/users.api";
import { formatIdOrder } from "./formatIdOrder";

export const filterUsersByKey = (
  users: UserInfo[], 
  key: keyof UserInfo, 
  value: UserInfo[keyof UserInfo], 
  fuzzySearch?: boolean
): UserInfo[] => {

  return users.filter(user => {
    const userValue = user[key];

    if (fuzzySearch && typeof userValue === 'string' && typeof value === 'string') {
      return userValue.toLowerCase().includes(value.toLowerCase());
    } else {
      return userValue === value;
    }
  });
};

export const filterUsersByMultipleFields = (
  users: UserInfo[], 
  searchValue: string, 
  fields: (keyof UserInfo)[] = ['email', 'id']
): UserInfo[] => {
  if (!searchValue.trim()) return users;

  const searchTerm = searchValue.toLowerCase().trim();

  return users.filter(user => {
    return fields.some(field => {
      const userValue = user[field];
      if (typeof userValue === 'string') {
        return userValue.toLowerCase().includes(searchTerm);
      }
      return false;
    });
  });
};

export const filterOrdersByKey = (
  orders: OrderInfo[] | undefined, 
  key: keyof OrderInfo, 
  value?: OrderInfo[keyof OrderInfo], 
  fuzzySearch?: boolean
): OrderInfo[] => {
  if (!orders || !Array.isArray(orders)) return [];

  return orders.filter(order => {
    if (!order) return false;

    if (key === "id" && value) {
      const formattedId = formatIdOrder(order.id, "o");
      if (fuzzySearch && typeof value === "string") {
        return formattedId.toLowerCase().includes(value.toLowerCase());
      }
      return formattedId === value;
    }
    
    const orderValue = order[key];

    if (fuzzySearch && typeof orderValue === 'string' && typeof value === 'string') {
      return orderValue.toLowerCase().includes(value.toLowerCase());
    } else {
      return orderValue === value;
    }
  });
};

export const filterOrdersMatchByKey = (
  orders: OrderMatch[] | undefined, 
  key: keyof OrderMatch, 
  value?: OrderMatch[keyof OrderMatch], 
  fuzzySearch?: boolean
): OrderMatch[] => {
  if (!orders || !Array.isArray(orders)) return [];

  return orders.filter(order => {
    
    if (key === "id" && value) {
      const formattedId = formatIdOrder(order.id, "m");
      if (fuzzySearch && typeof value === "string") {
        return formattedId.toLowerCase().includes(value.toLowerCase());
      }
      return formattedId === value;
    }

    const orderValue = order[key];

    if (fuzzySearch && typeof orderValue === 'string' && typeof value === 'string') {
      return orderValue.toLowerCase().includes(value.toLowerCase());
    } else {
      return orderValue === value;
    }
  });
};
export const filterContestsByKey = (
  contests: Contest[], 
  key: keyof Contest, 
  value: Contest[keyof Contest], 
  fuzzySearch?: boolean
): Contest[] => {

  return contests.filter(contest => {
    const contestValue = contest[key];
    
    if (fuzzySearch && typeof contestValue === 'string' && typeof value === 'string') {
      console.log("contestValue",  contestValue.toLowerCase().includes(value.toLowerCase()))
      return contestValue.toLowerCase().includes(value.toLowerCase());
    } else {
      return contestValue === value;
    }
  });
};

export const filterBannerEventsByKey = (
  banners: BannerEvent[], 
  key: keyof BannerEvent, 
  value: BannerEvent[keyof BannerEvent], 
  fuzzySearch?: boolean
): BannerEvent[] => {

  return banners.filter(banner => {
    const bannerValue = banner[key];
    
    if (fuzzySearch && typeof bannerValue === 'string' && typeof value === 'string') {
      return bannerValue.toLowerCase().includes(value.toLowerCase());
    } else {
      return bannerValue === value;
    }
  });
};