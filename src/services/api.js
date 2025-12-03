export async function login(email,password){
    const res= await fetch(`${process.env.REACT_APP_BASE_URL}/auth/login`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password}),
    });
    return await res.json()
}
export async function register(email,password){
    return await fetch(`${process.env.REACT_APP_BASE_URL}/auth/register`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password}),
    });
}
export async function shorten(url,token,custom=undefined,expires_in=undefined){
    const res= await fetch(`${process.env.REACT_APP_BASE_URL}/links/shorten`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            ...(token?{Authorization:`Bearer ${token}`}:{}),
        },  
        body:JSON.stringify({url,custom,expires_in}),
    });
    if(!res.ok){
        const errorBody=await res.json();
        const error=new Error("Error shortening URL");
        error.body=errorBody;
        throw error;
    }
    return await res.json();
}
export async function getLinks(token) {
  const res= await fetch(`${process.env.REACT_APP_BASE_URL}/links`, {
    method: "GET",
     headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  //console.log(res);
  const data= await res.json();
  //console.log(data)
  return data;
}
export async function deleteLink(code, token) {
  // if (!code) throw { status: 400, body: { message: "code is required" } };

  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  return fetch(`${process.env.REACT_APP_BASE_URL}/links/${encodeURIComponent(code)}`, {
    method: "DELETE",
    headers,
  });
}

export async function getAnalytics(code, token) {
  // if (!code) throw { status: 400, body: { message: "code is required" } };
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res=await  fetch(`${process.env.REACT_APP_BASE_URL}/analytics/${encodeURIComponent(code)}`, {
    method: "GET",
    headers,
  });
  //console.log(res);
  const data=await res.json();
  //console.log(data)
  return data;
}