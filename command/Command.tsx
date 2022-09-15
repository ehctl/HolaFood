export interface Command<Params = any> {
    execute(params?: Params): Promise<void>;
    canExecute(params?: Params): boolean;
}

export const CommandExecuter = <Params = any>(
    command: Command,
    params?: Params
) => {
    if (command.canExecute(params)) {
        command.execute(params)
    } else {
        console.log('Please fill the required params')
    }
}