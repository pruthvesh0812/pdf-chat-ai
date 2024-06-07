import { createClient } from "redis";

export const MQClient = createClient();

// const isConnected:boolean = false;


export const redisConnect = async () => {

    try{
        await MQClient.connect();
      
        console.log("redis connected");
    }
    catch(err){
        console.log("connection failed, error: ", err);
    }
}

