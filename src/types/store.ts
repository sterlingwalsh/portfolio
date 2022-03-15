export interface IAction<T = string, P = any> {
    type: T;
    storeOnly?: boolean;
    payload?: P;
}
