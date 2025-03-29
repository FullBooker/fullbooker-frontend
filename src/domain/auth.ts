export interface UserCredentials {
    email: string;
    password: string;
}

export interface ChangePasswordPayload {
    identifier: string;
    password: string;
    confirm_password: string;
}