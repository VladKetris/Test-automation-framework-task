export interface UiCommand {
    execute(): Promise<void>;
    undo?(): Promise<void>;
}

export class CommandBus {
    private readonly history: UiCommand[] = [];

    async execute(command: UiCommand): Promise<void> {
        await command.execute();
        this.history.push(command);
    }

    async executeAll(commands: UiCommand[]): Promise<void> {
        for (const command of commands) {
            await this.execute(command);
        }
    }

    async undoLast(): Promise<void> {
        const command = this.history.pop();
        if (command?.undo) {
            await command.undo();
        }
    }
}
