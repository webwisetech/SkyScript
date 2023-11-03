import { evaluate } from "../../runtime"
import Environment from "../../runtime/env"
import { Runtime, ObjectValue } from "../../runtime/val"
import { MemberExpression, Identifier } from "../../syntax/ast"
import { SkyScriptErr } from "../../util/error"

export function MemberExpr(Expression: MemberExpression, env: Environment): Runtime {
    const object = evaluate(Expression.object, env)
    const property = (Expression.property as Identifier).symbol
  
    if (object.type === 'object') {
        const objValue = object as ObjectValue
        const propertyValue = objValue.properties.get(property)
        
        if (propertyValue !== undefined) {
            return propertyValue
        } else {
            throw `Property "${property}" does not exist on object.`;
      }
    } else {
        throw new SkyScriptErr('Cannot access property on non-object value.');
    }
}