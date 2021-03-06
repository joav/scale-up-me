import { ForbiddenError } from "apollo-server-errors";
import { some } from "lodash";
import { AuthResponse } from "./Auth";

export function permisions(list: string[], module: string) {
    return (
        target: Object,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args:any[]) {
            const ctx: AuthResponse = args[2];
            module = module === 'row'?args[1].moduleSlug:module;
            const perms = ["unrestricted"].concat(list.map(p => `${p}-${module}`));
            let withPermisions = module === null || some(ctx.user.permisions, p => perms.includes(p));
            if(withPermisions){
                const result = originalMethod.apply(this, args);
                return result;
            }else{
                throw new ForbiddenError(`You don't have none of this permisions: ${perms.slice(1).join(', ')}`);
                
            }
        }
        return descriptor;
    }
}
