

export const getData = async (endpoint:string) => {
    try {
        const respone = await fetch(endpoint,{
            method: 'GET',
            headers:{
                "Content-Type": 'application/json'
            }
        })
        if(!respone.ok){
            throw new Error()
        }
        return respone.json()
        
    } catch (error) {
        console.log(error)  
        throw error
    }
}