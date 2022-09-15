import { ApiRequest, ApiResponse, api, ApiMethod } from "./Api";


export class ApiExecutor<REQ extends Object, RES> {
    _request: ApiRequest<REQ> | undefined
    _response: ApiResponse<RES> | undefined

    async execute(params: ExecuteParams<REQ, RES>) {
        this._request = params.request
        params.prefetch?.();

        const response = await api<REQ, RES>(params.method, params.request)
        this._response = response
        if (params.validateResponse?.(response.body)) {
            params.callback(response)
            params.postFetch?.()
        }
        else 
            console.log('Invalid response type')
    }
}

export type ExecuteParams<REQ extends Object, RES> = {
    method: ApiMethod,
    request: ApiRequest<REQ>,
    validateResponse?: (response: any) => boolean
    callback: (response: ApiResponse<RES>) => void,
    prefetch?: () => void,
    postFetch?: () => void,
}