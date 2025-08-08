import { Todo } from "./Todo";
export declare class User {
    uuid: string;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
    todos: Todo[];
}
