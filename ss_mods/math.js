export default ({ library, makeNumber }) => {
    try{
            library.createFunction("add", (args, env) => {
            const num1 = args[0].value || args[0];
            const num2 = args[1].value || args[1];
            return makeNumber(num1+num2)
        })
    } catch(e){
        console.error(e);
    }
}