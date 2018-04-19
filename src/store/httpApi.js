import axios from "axios";

var defaultHeaders = {
    'Cache-Control': 'no-cache,no-store,must-revalidate,max-age=-1',
    'Content-Type': 'application/json'
}

function defaultHeadersWithToken(token){
    if(token) {
        return Object.assign({}, defaultHeaders, {"user-id": token});
    }else{
        return defaultHeaders;
    }
}


export function get(path, data, excludeToken) {
    return (dispatch, getState) => {
        return axios.get(path, {
            params: data,
            headers: (excludeToken?defaultHeaders: defaultHeadersWithToken(getState().session.id)),
        }).then(r=>r.data)
    }
}


export function post(path, data) {
    return (dispatch, getState) => {
        return axios.post(path,data,  {
            headers: defaultHeadersWithToken(getState().session.id),
        }).then(r=>r.data)
    }
}

export function put(path, data) {
    return (dispatch, getState) => {
        return axios.put(path,data,  {
            headers: defaultHeadersWithToken(getState().session.id),
        }).then(r=>r.data)
    }
}

export function del(path) {
    return (dispatch, getState) => {
        return axios.delete(path, {
            headers: defaultHeadersWithToken(getState().session.id),
        }).then(r=>r.data)
    }
}

