import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"
import { FoodListType } from "../../components/FoodList/FoodListType";
import { Constant } from "../../utils/Constant";
import { DOMAIN, ORI_DOMAIN } from "./Constant";

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
                    console.log(e)
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

        if (response.status === 200 && response.data.user != undefined) {
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
        // url: 'https://mocki.io/v1/6ab0409e-5d8a-4e87-b11c-77f19914f3e2',
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
                    console.log(e)
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
                    console.log(e)
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
                    console.log(e)
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
        // url: 'https://mocki.io/v1/3650dac3-486d-4645-8255-ee2c8c96a36e',
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
                    console.log(e)
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
                    console.log(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}


export const getFoodReviews = (
    foodId: number,
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'GET',
        params: {
            productId: foodId
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
                    console.log(e)
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
        // url: 'https://mocki.io/v1/7c06a494-26c4-4210-beb8-13287eec3c74',
        url: DOMAIN + '/review/add'
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
                    console.log(e)
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
        // url: 'https://mocki.io/v1/6d124633-b665-45ee-8c02-21cbabc6ef50',
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
                    console.log(e)
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
                    console.log(e)
                }))
        })
        .catch((e) => {
            failure(e)
        })
}

export const addNewAddress = (
    address: string,
    success: (data: any) => void,
    failure: (error: any) => void
) => {
    const option = {
        method: 'POST',
        data: {
            address: address
        },
        // url: 'https://mocki.io/v1/0fc2e3d9-e4bd-431a-9159-ca71adb563e3',
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
                    console.log(e)
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
                    console.log(e)
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
                    console.log(e)
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
                    console.log(e)
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
                    console.log(e)
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
                console.log(e)
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