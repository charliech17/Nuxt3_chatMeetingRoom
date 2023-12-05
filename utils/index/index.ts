const allPicList = ["1","2","3","4","5"]
const word = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolo incididunt ut labore",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam re",
    "umquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima ",
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti ",
    "debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.t"
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
    },3000)
}

export function transformStart(imgContainerID: string) {
    const imgContainer = getImageContainer(imgContainerID)
    if(imgContainer) {
        imgContainer.style.transition = `transform 1.5s`
        imgContainer.style.transform = `translateX(-${nowTransition}%)`
    }
}

function getImageContainer(imgContainerID: string):HTMLElement {
    return document.getElementById(imgContainerID)!
}