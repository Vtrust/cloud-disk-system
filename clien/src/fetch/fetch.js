import axios from 'axios';

let config = {
    baseURL: '/api',
    withCredentials:true,
    transformRequest: [
        function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            
            return ret
        }
    ],
    transformResponse: [
        function (data) {
            return data
        }
    ],
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    timeout: 10000,
    responseType: 'json'
};
const instance = axios.create(config);
//axios.defaults.withCredentials=true;//解决登陆session每次都不一样
instance.interceptors.response.use(function(res){
    //相应拦截器
    console.log(res);
    
    return res.data;
});


export function get(url) {
    
    return instance.get(url)
}

export function post(url, data) {
    return instance.post(url, data)
}