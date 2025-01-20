export interface UserCredentials {
    phone_number: string;
    password: string;
}

export interface ChangePasswordPayload {
    identifier: string;
    password: string;
    confirm_password: string;
}