import {scaleImage} from  "@/utils/poc/carousel/touchMove"


// ====================  init !!start!! ================== //
const allPicList = ["1","2","3","4","5"]
const baseAssetsPath = "/testImage/"

export function init(nowPickList: Ref) {
    lifeCycle_Settings()
    setPicList(nowPickList)
    disablePullReload()
}

function setPicList(nowPickList: Ref) {
    const lastItem = allPicList[allPicList.length - 1]
    const firstItem = allPicList[0]
    const secondItem = allPicList[1]
    const imageOrder = [lastItem,firstItem,secondItem]
    
    nextTick(()=> {
        imageOrder.forEach((item) => {
            nowPickList.value.push({
                name: item,
                url:  new URL(baseAssetsPath + item + ".jpg", import.meta.url).href,
            })
        })
    })
}

function disablePullReload() {
    document.body.style.overflow = 'hidden'
    document.getElementsByTagName("html")[0].style.overflow = 'hidden' 
}

function lifeCycle_Settings() {
    useHead({
        meta: [
            {
                name: 'viewport',
                content: "width=device-width, user-scalable=no"
            }
        ]
    })
}

// ====================  init !!end!! ================== //

function getImageContainer():HTMLDivElement {
    return document.querySelector(".img_container")!
}

let nowTransition = 200
let orignTransition = 100
export function transformStart() {
    const imgContainer = getImageContainer()
    imgContainer!.style.transition = `transform 1.5s`
    imgContainer.style.transform = `translateX(-${nowTransition}vw)`
}

export function handleLoop(nowPickList: Ref) {
    const imgContainer = getImageContainer()
    imgContainer!.style.transition = ``
    
    nowPickList.value.shift()
    const newData = Number(nowPickList.value[1].name) + 1
    const finalData = newData > 5 ? 1 : newData
    
    nowPickList.value.push({
        name: finalData.toString(),
        url:  new URL(baseAssetsPath + finalData.toString() + ".jpg", import.meta.url).href,
    })

    nextTick(()=> {
        imgContainer!.style.transform = `translateX(-${orignTransition}vw)`
    })

    setTimeout(()=>{
        transformStart()
    },1000)
}


export {
    scaleImage
}
