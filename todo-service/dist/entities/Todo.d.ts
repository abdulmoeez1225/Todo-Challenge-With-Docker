import { User } from "./User";
export declare class Todo {
    id: number;
    user_uuid: string;
    title: string;
    description: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    user: User;
}
