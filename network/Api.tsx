
export async function api<REQ extends Object, RES >(method: ApiMethod, request: ApiRequest<REQ>): Promise<ApiResponse<RES>> {
    var header = {
        'Content-Type': 'application/json',
    }

    return intercepter<RES>(fetch(
        request.url,
        {
            method: method,
            credentials: "same-origin",
            headers: header,
            body: method === 'POST' ? request?.body?.toString() : null
        }
    ))
}

async function intercepter<T>(promise: Promise<Response>): Promise<ApiResponse<T>> {
    var apiResponse = new ApiResponse<T>()
    try {
        var response = await promise

        if (response.ok) {
            apiResponse.body = await response.json()
            apiResponse.isSuccess = true
        }

        apiResponse.headers = response.headers
        apiResponse.status = response.status
        apiResponse.statusText = response.statusText
        apiResponse.redirected = response.redirected
        apiResponse.url = response.url

    } catch (err: any) {
        console.log(err)
        apiResponse.isSuccess = false
        apiResponse.error = err
    } finally {
        return apiResponse
    }
}

export class ApiRequest<T>{
    url: string = '';
    token?: string;
    body?: T;
}

export class ApiResponse<T> {
    url?: string;
    redirected?: boolean = false;
    headers?: Headers;
    isSuccess: boolean = false;
    status: number = 200;
    statusText?: string;
    body?: T;
    error?: any;
    timing: number = Date.now();
}

export type ApiMethod = 'GET' | 'POST'


