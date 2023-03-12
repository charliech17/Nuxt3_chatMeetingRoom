// TODO 加上close、disconnected、error事件的處理
export const initPeerSettings = (
        {peer, onOpenCallBack, dataReciveCallBack, onConnectionCallBack, onCallCallBack}: initSettingsType 
    ) => {
        
        // @ 自己裝置連接上peer
        peer.on('open',()=> {
            if(onOpenCallBack) {
                onOpenCallBack()
            }
        })

        // @ 別的裝置連接上
        peer.on("connection", (conn:any) => {
            conn.on("data", (data: string) => {
                if(dataReciveCallBack) {
                    dataReciveCallBack()
                }
            });
            conn.on("open", () => {
                if(onConnectionCallBack) {
                    onConnectionCallBack()
                }
            });
        });

        //  @ 別的裝置call
        peer.on("call", (call: any) => {
            if(onCallCallBack) {
                onCallCallBack()
            }
        })

        //  @ 自己裝置關閉peer連線
        peer.on('close', function() { 
            
        });
        
        //  @ 自己裝置斷線
        peer.on('disconnected', function() { 
            
        })

        //  @ 發生錯誤
        peer.on('error',(error: Error)=> {

        })
    }

//  ################## type ##################  //

interface initSettingsType {
    peer: any, 
    onOpenCallBack?: Function, 
    dataReciveCallBack?: Function, 
    onConnectionCallBack?:Function,
    onCallCallBack?:Function,
}