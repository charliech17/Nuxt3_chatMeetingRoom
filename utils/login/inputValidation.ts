type nowPageType = 'login'|'register'
let nowPage:nowPageType;

export const emailRules = (nowPage: nowPageType) => [ 
    (input:any) => {
        return (
            !input || 
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(input) || 
            (nowPage === 'login' ? 'email 輸入有誤' : 'email格式有誤')
        )
    }
]

export const passwordValid = (nowPage: nowPageType) => [
    (input:any) => {
        return (
            !!input  || 
            (nowPage === 'login' ? '密碼不可為空' : '')
        )
    },
    (input:any) => {
        return (
            input.length >= 6 || 
            (nowPage === 'login' ? '長度需6碼以上' : '密碼長度需6-12碼中英數')
        )
    }
]