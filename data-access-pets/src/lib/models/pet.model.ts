export type Pet = {
    id: number;
    name: string;
    kind: 'dog' | 'cat';
    weight: number;
    height: number;
    length: number;
    photo_url: string;
    description: string;
    number_of_lives?: number;
};
