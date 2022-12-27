import axios from "axios";

async function listarTodoAxios() {
    const res = await axios.get('/api/productos',{
        baseURL: "http://localhost:8080",
        headers: {
            "Content-Type": "application/json"
        }
    });
    console.log(res.data)
    return res.data;
}

async function listarAxios(params) {
    const res = await axios.get(`api/productos/${params}`,{
        baseURL: "http://localhost:8080",
        headers: {
            "Content-Type": "application/json"
        }
    })
    console.log(res.data)
    return res.data;
}

async function agregarAxios() {
    const res = await axios.post("http://localhost:8080/api/productos/",
        {
            id: '63964db6200731d08c669dbb',
            name: 'Atrapasueños MODIFICADO',
            price: 1000,
            img: 'https://creaciones-natu.vercel.app/images/buho.jpeg',
            stock: 5
        },[{
            headers: {
                "Content-Type": "application/json"
            }
    }])
    return res.data;
}
// console.log(listarAxios("63964db6200731d08c669dbb"));
// console.log(agregarAxios());
console.log(listarTodoAxios());