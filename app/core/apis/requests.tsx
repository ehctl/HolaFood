import axios from "axios"

export const getSearchResult = (
    text: string,
    success: (data: any) => void,
    failure: (error: any) => void,
    abortController?: AbortController,
) => {
    const option = {
        method: 'GET',
        params: {
            text: text
        },
        url: 'https://mocki.io/v1/1521c3a7-72d0-4148-b870-b854b5edd359',
        signal: abortController.signal
    }

    axios(option).then((response) => {
        if (response.status === 200) {
            success(response.data);
        } else {
            failure(response);
        }
    })
    .catch((e) => {
        console.log(e)
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
        url: 'https://mocki.io/v1/6ab0409e-5d8a-4e87-b11c-77f19914f3e2',
    }

    axios(option).then((response) => {
        if (response.status === 200) {
            success(response.data);
        } else {
            failure(response);
        }
    })
    .catch((e) => {
        console.log(e)
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
            shopId: shopId
        },
        url: 'https://mocki.io/v1/1577d69d-5fbf-4af9-a9a0-9313e8a94198',
    }

    axios(option).then((response) => {
        if (response.status === 200) {
            success(response.data);
        } else {
            failure(response);
        }
    })
    .catch((e) => {
        console.log(e)
    })
}

export const getFoodList = (
    userId: string,
    type: string,
    page: number,
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'GET',
        params: {
            type: type
        },
        url: 'https://mocki.io/v1/1577d69d-5fbf-4af9-a9a0-9313e8a94198',
    }

    axios(option).then((response) => {
        if (response.status === 200) {
            success(response.data);
        } else {
            failure(response);
        }
    })
    .catch((e) => {
        console.log(e)
    })
}

export const getFoodDetail = (
    userId: string,
    foodId: string,
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'GET',
        params: {
            foodId: foodId
        },
        url: 'https://mocki.io/v1/3650dac3-486d-4645-8255-ee2c8c96a36e',
    }

    axios(option).then((response) => {
        if (response.status === 200) {
            success(response.data);
        } else {
            failure(response);
        }
    })
    .catch((e) => {
        console.log(e)
    })
}


export const getFoodReviews = (
    userId: string,
    foodId: string,
    page: number,
    success: (data: any) => void,
    failure: (error: any) => void,
) => {
    const option = {
        method: 'GET',
        params: {
            foodId: foodId
        },
        url: 'https://mocki.io/v1/7c06a494-26c4-4210-beb8-13287eec3c74',
    }

    axios(option).then((response) => {
        if (response.status === 200) {
            success(response.data);
        } else {
            failure(response);
        }
    })
    .catch((e) => {
        console.log(e)
    })
}
