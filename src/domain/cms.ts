export type CMSPage = {
    id: string;
    title: string;
    slug: string;
    is_active: boolean;
}

export type CMSPageContent = {
    id: string;
    type: string;
    value: string;
    language: string;
    is_active: boolean;
}