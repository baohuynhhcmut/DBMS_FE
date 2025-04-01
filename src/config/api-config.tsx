
type Config = {
    baseUrl:string;
}

const checkConfig = (server:string) : Config | {} => {
    let config:Config | {} = {}
    switch (server) {
        case 'product':
            config = {
                baseUrl:''
            }
            break;
        case 'json-server':
            config = {
                baseUrl:'http://localhost:3000/'
            }
            break
        case 'local':
            config = {
                baseUrl:''
            }
            break
        default:
            break;
    }
    return config
}

export const serverSelected = 'json-server'

const config = checkConfig(serverSelected)

export default config as Config;
