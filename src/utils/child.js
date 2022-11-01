process.on("message", async function (data) {
    console.log(`Message from main.js: ${data}`);
    const reducir = data.reduce( ( obj , item ) => {
        if( !obj[ item ] ){
            obj[ item ] = 1
        } else{
            obj[ item ] = obj[ item ] + 1;
        }
        return obj
    }, {} );
    
    process.send(await reducir)
});