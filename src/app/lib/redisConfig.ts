import { createClient } from "redis";

export const MQClient = createClient();

let isConnected:boolean = false;


export const redisConnect = async () => {

    try{
        if(!isConnected){
            await MQClient.connect();
            isConnected=true;
        }
        else{
            console.log(MQClient.info(),"status redis")
        }
      
        console.log("redis connected");
    }
    catch(err){
        console.log("connection failed, error: ", err);
    }
}

