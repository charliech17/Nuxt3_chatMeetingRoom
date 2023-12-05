const allPicList = ["1","2","3","4","5"]
const word = [
    "真的不錯用",
    "很方便",
    "好玩",
    "你好",
    "測試"
]
const baseAssetsPath = "/index/carousel/"
let nowTransition = 100
let orignTransition = 0


export function setPicList(nowPickList: Ref) {
    const lastItem = allPicList[allPicList.length - 1]
    const firstItem = allPicList[0]
    const secondItem = allPicList[1]
    const imageOrder = [lastItem,firstItem,secondItem]
    nextTick(()=> {
        imageOrder.forEach((item,index) => {
            nowPickList.value.push({
                name: item,
                url:  new URL(baseAssetsPath + item + ".png", import.meta.url).href,
                word: word[Number(item)-1]
            })
        })
    })
}

export function handleLoop(nowPickList: Ref,imgContainerID: string) {
    const imgContainer = getImageContainer(imgContainerID)
    imgContainer!.style.transition = ``
    
    nowPickList.value.shift()
    console.log(nowPickList.value)
    const newData = Number(nowPickList.value[1].name) + 1
    const finalData = newData > allPicList.length  ? 1 : newData
    
    nowPickList.value.push({
        name: finalData.toString(),
        url:  new URL(baseAssetsPath + finalData.toString() + ".png", import.meta.url).href,
        word: word[finalData-1]
    })

    nextTick(()=> {
        imgContainer!.style.transform = `translateX(-${orignTransition}%)`
    })

    setTimeout(()=>{
        transformStart(imgContainerID)
    },4000)
}

export function transformStart(imgContainerID: string) {
    const imgContainer = getImageContainer(imgContainerID)
    imgContainer!.style.transition = `transform 1.5s`
    imgContainer.style.transform = `translateX(-${nowTransition}%)`
}

function getImageContainer(imgContainerID: string):HTMLElement {
    return document.getElementById(imgContainerID)!
}