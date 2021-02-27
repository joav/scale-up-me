export const notFound = (object: string) => `The ${object} not found`;
export const empty = (object: string) => `The ${object} can not be empty`;
export const exists = (object: string) => `The ${object} already exists`;
export const wrongFormat = (object: string, contains: string) => `The ${object} should only contain ${contains}`;
export const minLength = (object: string, length: number) => `The ${object} must be at least ${length} characters`;