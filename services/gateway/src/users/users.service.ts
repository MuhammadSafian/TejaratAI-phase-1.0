import { Injectable } from '@nestjs/common';

// Temporary mock for users DB until ORM is set
export type User = any;

@Injectable()
export class UsersService {
    private readonly users: User[] = [];

    async findOne(email: string): Promise<User | undefined> {
        return this.users.find(user => user.email === email);
    }
}
