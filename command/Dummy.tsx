import { ApiResponse } from "../network/Api";
import { ApiExecutor } from "../network/Fetch";
import { Command } from "./Command";

export interface DummyCommandParams {
    first: string,
    second: number
}

export class DummyCommand implements Command<DummyCommandParams> {
    public async execute(params?: DummyCommandParams | undefined): Promise<void> {
        var executor = new ApiExecutor<DummyRequest, DummyResponse>()
        executor.execute({
            method: "GET",
            request: {
                url: 'https://mocki.io/v1/d4867d8b-b5d5-4a48-a4ab-79131b5809b8'
            },
            validateResponse: (response: any) => {
                return Array.isArray(response) && (response.length == 0 || response.every(r => r.name != undefined && r.city != undefined))
            },
            callback: (response: ApiResponse<DummyResponse>) => {
                console.log(response)
            },
        })
    }

    public canExecute(params?: DummyCommandParams | undefined): boolean {
        if (params?.first && params?.second)
            return true
        else
            return false
    }

}

type DummyRequest = {

}

type DummyResponse = {
    name: string,
    city: string
}[]
