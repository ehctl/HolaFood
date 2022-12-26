import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"
import { FoodListType } from "../../components/FoodList/FoodListType";
import { CartItemData } from "../../components/Order/Cart";
import { OrderData } from "../../components/Order/OrderItem";
import { Constant } from "../../utils/Constant";
import { DOMAIN, GOOGLE_DISTANCE_API_URL, GOOGLE_MAP_API_KEY, GOOGLE_MAP_SUGGEST_ADDRESS_API_URL, ORI_DOMAIN } from "./Constant";

export const getSearchResult = (
    text: string,
    pageIndex: number,
    success: (data: any) => void,
    failure: (error: any) => void,
    abortController?: AbortController,
) => {
    const option = {
        method: 'GET',
        params: {
            search: text,
            index: pageIndex
        },
        url: DOMAIN + '/search/productandshop',
        signal: abortController?.signal
    }


    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200 && response.data.success) {
                        success(response.data);
                    } else {
                        failure(response);
                    }
                })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const getUserInfo = async () => {
    const option = {
        method: 'GET',
        params: {
        },
        url: DOMAIN + '/user/getinfo',
    }

    try {
        const newOption = await addHeaderToken(option)
        const response = await axios(newOption)

        if (response.status === 200 && response.data.success) {
            return response.data;
        } else {
            throw response.data;
        }
    } catch (e) {
        throw new Error(e);
    }
}

export const updateUserInfo = (
    firstName: string,
    lastName: string,
    phone: string,
    success: (data: any) => Promise<void> | void,
    failure: (error: any) => Promise<void> | void,
) => {
    const option = {
        method: 'POST',
        data: {
            firstName: firstName,
            lastName: lastName,
            phone: phone
        },
        url: DOMAIN + '/user/updateuserinfo',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200 && response.data.success) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
        })
        .catch((e) => {
            failure(e)
        })
}

export const getShopInfo = (
    shopId: string,
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'GET',
        params: {
            shopId: shopId
        },
        url: DOMAIN + '/shop/getinfoshop',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200 && response.data.success) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
        })
        .catch((e) => {
            failure(e)
        })
}

export const getShopListFood = (
    shopId: string,
    page: number,
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'GET',
        params: {
            searchBy: 'shopId',
            id: shopId,
            index: page,
        },
        url: DOMAIN + '/product/getproductby',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200) {
                        success(response.data);
                    } else {
                        failure(response);
                    }
                })
        })
        .catch((e) => {
            failure(e)
        })
}

export const getFoodList = (
    value: any,
    page: number,
    success: (data: any) => void,
    failure: (error: any) => void,
    abortController?: AbortController,
) => {
    switch (value) {
        case FoodListType.FAVORITE_FOOD:
            return getFoodListByType('favorite', page, success, failure, abortController)
        case FoodListType.NEW_FOOD:
            return getFoodListByType('new', page, success, failure, abortController)
        case FoodListType.POPULAR_FOOD:
            return getPopularFood(success, failure, abortController)
        default:
            getFoodListByCategory(value as number, page, success, failure, abortController)
    }

}

export const getFoodListByCategory = (
    categoryId: number,
    page: number,
    success: (data: any) => void,
    failure: (error: any) => void,
    abortController?: AbortController,
) => {
    const option = {
        method: 'GET',
        params: {
            searchBy: 'category',
            id: categoryId,
            index: page
        },
        // url: 'https://mocki.io/v1/c08ac5c9-78b3-4bc6-9afe-dd8e4dc4a3ca',
        url: DOMAIN + '/product/getproductby',
        signal: abortController?.signal
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200 && response.data.success) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const getFoodListByType = (
    type: string,
    page: number,
    success: (data: any) => void,
    failure: (error: any) => void,
    abortController?: AbortController,
) => {
    const option = {
        method: 'GET',
        params: {
            searchBy: type,
            id: 0,
            index: page
        },
        url: DOMAIN + '/product/getproductby',
        signal: abortController?.signal
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200 && response.data.success) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const getPopularFood = (
    success: (data: any) => void,
    failure: (error: any) => void,
    abortController?: AbortController,
) => {
    const option = {
        method: 'GET',
        params: {
        },
        url: DOMAIN + '/product/getpopularproduct',
        signal: abortController?.signal
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200 && response.data.success) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const getFoodDetail = (
    foodId: string,
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'GET',
        params: {
            searchBy: 'productId',
            id: foodId,
            index: 0
        },
        url: DOMAIN + '/product/getproductby',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const getFoodOption = (
    foodId: string,
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'GET',
        params: {
            productId: foodId
        },
        url: DOMAIN + '/option/getoptionbyproduct',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200 && response.data.success) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}


export const getFoodReviews = (
    foodId: number,
    pageIndex: number,
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'GET',
        params: {
            productId: foodId,
            index: pageIndex
        },
        url: DOMAIN + '/review/getreviewbyproduct',
    }


    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const addFoodReview = (
    foodId: number,
    review: string,
    star: number,
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'POST',
        data: {
            productId: foodId,
            review: review,
            star: star
        },
        url: DOMAIN + '/review/add'
    }


    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200 && response.data.success) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const deleteFoodReview = (
    reviewId: number,
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'POST',
        data: {
            id: reviewId,
        },
        url: DOMAIN + '/review/delete'
    }


    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200 && response.data.success) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const updateFoodReview = (
    foodId: number,
    review: string,
    star: number,
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'POST',
        data: {
            id: foodId,
            review: review,
            star: star
        },
        url: DOMAIN + '/review/update'
    }


    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const getFoodCategory = (
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'GET',
        params: {
        },
        url: DOMAIN + '/category/getall',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200 && response.data.success) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const getListAddress = (
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'GET',
        params: {
        },
        // url: 'https://mocki.io/v1/0fc2e3d9-e4bd-431a-9159-ca71adb563e3',
        url: DOMAIN + '/address/getaddress',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200 && response.data.success) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}


export const getCartItems = (
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'GET',
        params: {
        },
        url: DOMAIN + '/cart/getcart',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200 && response.data.success) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
                .catch(((e) => {
                    failure(e)
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const addCart = (
    cartItem: CartItemData,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'POST',
        data: {
            amount: cartItem.quantity,
            productid: cartItem.productDetail.id,
            note: cartItem.note,
            price: cartItem.price,
            option: cartItem.option.map((i) => ({
                id: i.id
            }))
        },
        url: DOMAIN + '/cart/add',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption).then((response) => {
                if (response.status === 200 && response.data.success) {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const updateCart = (
    cartItem: CartItemData,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'POST',
        data: {
            id: cartItem.id,
            amount: cartItem.quantity,
            productid: cartItem.productDetail.id,
            note: cartItem.note,
            price: cartItem.price,
            option: cartItem.option.map((i) => ({
                id: i.id
            }))
        },
        url: DOMAIN + '/cart/update',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption).then((response) => {
                if (response.status === 200 && response.data.success) {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}


export const deleteCart = (
    cartItemId: number,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'POST',
        data: {
            id: cartItemId,
        },
        url: DOMAIN + '/cart/delete',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption).then((response) => {
                if (response.status === 200 && response.data.success) {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    failure(e)
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const getShipperOrderQueue = (
    sortType: string,
    sortOrder: string,
    shopId: number,
    pageIndex: number,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    return getOrders(2, shopId, pageIndex, success, failure, sortType, sortOrder)
}

// get status 6, 3
export const getShipperProgressingOrder = (
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    return getOrders(9, 0, 0, success, failure)
}

// get status 1, 2, 3, 6
export const getActiveOrders = (
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    return getOrders(8, 0, 0, success, failure)
}

// get status 4, 5
export const getInactiveOrders = (
    pageIndex: number,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    return getOrders(7, 0, pageIndex, success, failure)
}

export const getAllOrders = (
    pageIndex: number,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    return getOrders(10, 0, pageIndex, success, failure)
}

export const getOrders = (
    status: number,
    shopId: number,
    index: number,
    success: (data: any) => void,
    failure: (error: any) => void,
    sortBy?: string,
    sort?: string
) => {
    const option = {
        method: 'GET',
        params: {
            status: status,
            shopId: shopId,
            index: index,
        },
        url: DOMAIN + '/order/getorder',
    }

    if (sortBy && sort)
        option.params = {
            ...option.params,
            ...{
                sortBy: sortBy,
                sort: sort
            }
        }

    return addHeaderToken(option).
        then((newOption) => {
            console.log(newOption)
            axios(newOption).then((response) => {
                if (response.status === 200 && response.data.success) {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const getOrderDetail = (
    orderId: number,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'GET',
        params: {
            orderId: orderId
        },
        url: DOMAIN + '/order/getorderbyid',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption).then((response) => {
                if (response.status === 200 && response.data.success) {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const addOrdersWithCartId = (
    orders: OrderData[],
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'POST',
        data: orders.map((i) => ({
            price: i.price,
            shipPrice: i.shipFee,
            shipOrder: i.shipFeeWithShopPolicy,
            distance: i.distance,
            address: i.address,
            cartDTO: i.items.map((cartItem) => ({
                id: cartItem.id
            }))
        })),
        url: DOMAIN + '/order/add',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption).then((response) => {
                if (response.status === 200 && response.data.success) {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const addOrdersWithCardData = (
    orders: OrderData[],
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'POST',
        data: orders.map((i) => ({
            price: i.price,
            shipPrice: i.shipFee,
            shipOrder: i.shipFeeWithShopPolicy,
            distance: i.distance,
            address: i.address,
            cartDTO: i.items.map((cartItem) => ({
                amount: cartItem.quantity,
                productid: cartItem.productDetail.id,
                note: cartItem.note,
                price: cartItem.price,
                option: cartItem.option.map((i) => ({
                    id: i.id
                }))
            }))
        })),
        url: DOMAIN + '/order/add',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption).then((response) => {
                if (response.status === 200 && response.data.success) {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const updateOrder = (
    orderId: number,
    orderStatus: number,
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'POST',
        data: {
            id: orderId,
            orderStatus: orderStatus
        },
        url: DOMAIN + '/order/update',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption).then((response) => {
                if (response.status === 200 && response.data.success) {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const cancelOrder = (
    orderId: number,
    cancelReason: string,
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'POST',
        data: {
            id: orderId,
            orderStatus: 5,
            noteCancel: cancelReason
        },
        url: DOMAIN + '/order/update',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption).then((response) => {
                if (response.status === 200 && response.data.success) {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const getNotification = (
    pageIndex: number,
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'GET',
        params: {
            index: pageIndex
        },
        url: DOMAIN + '/notifications/get',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption).then((response) => {
                if (response.status === 200 && response.data.success) {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const getNotificationDetailItems = (
    orderId: number,
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'GET',
        params: {
            orderid: orderId
        },
        url: DOMAIN + '/notifications/getnotibyorderid',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption).then((response) => {
                if (response.status === 200 && response.data.success) {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const checkNewNotification = (
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'GET',
        params: {
        },
        url: DOMAIN + '/notifications/notinew',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption).then((response) => {
                if (response.status === 200 && response.data.success) {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const updateSeenAllNotification = (
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'POST',
        data: {
        },
        url: DOMAIN + '/notifications/updatenotinew',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption).then((response) => {
                if (response.status === 200 && response.data.success) {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const getSuggestAddress = (
    text: string,
    success: (data: any) => void,
    failure: (error: any) => void,
    abortController?: AbortController,
) => {
    const option = {
        method: 'GET',
        params: {
            query: text,
            key: GOOGLE_MAP_API_KEY
        },
        url: GOOGLE_MAP_SUGGEST_ADDRESS_API_URL,
        signal: abortController?.signal
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption).then((response) => {
                if (response.status === 200 && response.data.status == "OK") {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    // failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const getDistance = (
    origin: string,
    destination: string,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'GET',
        params: {
            origins: origin,
            destinations: destination,
            mode: 'driving',
            region: 'vi',
            key: GOOGLE_MAP_API_KEY
        },
        url: GOOGLE_DISTANCE_API_URL,
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption).then((response) => {
                if (response.status === 200 && response.data.status == "OK") {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}


export const addNewAddress = (
    address: string,
    formatted_address: string,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'POST',
        data: {
            address: address,
            formatted_address: formatted_address
        },
        url: DOMAIN + '/address/add',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200 && response.data.success) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const deleteAddress = (
    id: number,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'POST',
        data: {
            id: id
        },
        url: DOMAIN + '/address/delete',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200 && response.data.success) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const getListFAQ = (
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'GET',
        params: {
        },
        url: DOMAIN + '/contact/getcontactbyuser',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const addNewFAQ = (
    userId: number,
    question: string,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'POST',
        data: {
            userID: userId,
            question: question
        },
        url: DOMAIN + '/contact/addcontact',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const updateProductFavorite = (
    userId: number,
    isFavorite: boolean,
    productId: number,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    isFavorite ? addFavorite(userId, productId, success, failure) : deleteFavorite(userId, productId, success, failure)
}

export const addFavorite = (
    userID: number,
    productId: number,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'POST',
        data: {
            userId: userID,
            productId: productId
        },
        url: DOMAIN + '/favorite/add',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption)
                .then((response) => {
                    if (response.status === 200) {
                        success(response.data);
                    } else {
                        failure(response.data);
                    }
                })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const deleteFavorite = (
    userID: number,
    productId: number,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'POST',
        data: {
            userId: userID,
            productId: productId
        },
        url: DOMAIN + '/favorite/delete',
    }

    return addHeaderToken(option).
        then((newOption) => {
            axios(newOption).then((response) => {
                if (response.status === 200) {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const addHeaderToken = (option) => {
    return AsyncStorage.getItem(Constant.APP_API_TOKEN).then((value: string) => {
        option = {
            ...option, ...{
                headers: {
                    Authorization: 'Bearer ' + value
                }
            }
        }

        return option
    })
}

export const login = (
    email: string,
    password: string,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'POST',
        data: {
            email: email,
            password: password
        },
        url: DOMAIN + '/login',
    }

    axios(option)
    .then((response) => {
            if (response.status === 200 && response.data.success) {
                success(response.data);
            } else {
                failure(response.data);
            }
        })
        .catch((e) => {
            failure(e)
        })
}

export const logout = (
    success: (data: any) => Promise<void> | void,
    failure: (error: any) => Promise<void> | void
) => {
    const option = {
        method: 'POST',
        data: {
        },
        url: ORI_DOMAIN + '/logout',
    }

    axios(option)
        .then((response) => {
            if (response.status === 200) {
                success(response.data);
            } else {
                failure(response.data);
            }
        })
        .catch((e) => {
            failure(e)
        })
}

export const signup = (
    firstName: string,
    lastName: string,
    password: string,
    email: string,
    phone: string,
    success: (data: any) => Promise<void> | void,
    failure: (error: any) => Promise<void> | void
) => {
    const option = {
        method: 'POST',
        data: {
            firstName: firstName,
            lastName: lastName,
            password: password,
            email: email,
            phone: phone,
        },
        url: 'http://swp490g52-env.eba-sk7m9gfw.ap-southeast-1.elasticbeanstalk.com/api/user/register',
    }

    axios(option)
        .then((response) => {
            if (response.status === 200 && response.data.success) {
                success(response.data);
            } else {
                failure(response.data);
            }
        })
        .catch((e) => {
            failure(e)
        })
}

export const changePassword = (
    oldPassword: string,
    newPassword: string,
    success: (data: any) => Promise<void> | void,
    failure: (error: any) => Promise<void> | void
) => {
    const option = {
        method: 'POST',
        data: {
            oldPassword: oldPassword,
            newPassword: newPassword
        },
        url: DOMAIN + '/user/changepass',
    }

    axios(option)
        .then((response) => {
            if (response.status === 200 && response.data.success) {
                success(response.data);
            } else {
                failure(response.data);
            }
        })
        .catch((e) => {
            failure(e)
        })
}

export const resetPassword = (
    email: string,
    success: (data: any) => Promise<void> | void,
    failure: (error: any) => Promise<void> | void
) => {
    const option = {
        method: 'GET',
        params: {
            email: email
        },
        url: DOMAIN + '/resetpassword',
    }

    axios(option)
        .then((response) => {
            if (response.status === 200 && response.data.success) {
                success(response.data);
            } else {
                failure(response.data);
            }
        })
        .catch((e) => {
            failure(e)
        })
}

export const verifyEmail = (
    email: string,
    success: (data: any) => Promise<void> | void,
    failure: (error: any) => Promise<void> | void
) => {
    const option = {
        method: 'GET',
        params: {
            email: email
        },
        url: DOMAIN + '/user/sendotp',
    }

    axios(option)
        .then((response) => {
            if (response.status === 200 && response.data.success) {
                success(response.data);
            } else {
                failure(response.data);
            }
        })
        .catch((e) => {
            failure(e)
        })
}

export const addNotificationToken = (
    token: string,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'POST',
        data: {
            token: token
        },
        url: DOMAIN + '/notificationstoken/add',
    }

    return addHeaderToken(option).
        then((newOption) => {
            console.log('new noti token', token)
            axios(newOption).then((response) => {
                if (response.status === 200) {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const deleteNotificationToken = (
    token: string,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'POST',
        data: {
            token: token
        },
        url: DOMAIN + '/notificationstoken/delete',
    }

    return addHeaderToken(option).
        then((newOption) => {
            console.log('new noti token', token)
            axios(newOption).then((response) => {
                if (response.status === 200) {
                    success(response.data);
                } else {
                    failure(response.data);
                }
            })
                .catch(((e) => {
                    failure(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}
