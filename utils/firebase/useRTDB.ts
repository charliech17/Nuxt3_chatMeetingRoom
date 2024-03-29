import { getDatabase, ref as FireBaseRef } from "firebase/database";
import { child, push, onValue } from "firebase/database";
import { get, set, update, remove } from "firebase/database";
const DB_SERCET = import.meta.env.VITE_FIREBASE_RTDB_KEY + "/"


// @ 讀取資料
export function getRTDBData(readPath:string,db_sercet: string=DB_SERCET): Promise<object | null | Error> {
  const dbRef = FireBaseRef(getDatabase());
  return get(child(dbRef, db_sercet + readPath))
    .then((snapshot) => {
      if (snapshot.exists()) {
        // TODO 拿掉console
        console.log(snapshot.val(),'!!!');
        return snapshot.val()
      } else {
        // No data available
        return null
      }
    })
    .catch((error) => {
      throw new Error(error)
    });
}

//  @ 確認DB有無資料
export function checkIsRTDBData(readPath:string): Promise<boolean | Error> {
  const dbRef = FireBaseRef(getDatabase());
  return get(child(dbRef, DB_SERCET + readPath))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return true
      } else {
        // No data available
        return false
      }
    })
    .catch((error) => {
      throw new Error(error)
    });
}


// @ 監聽資料更新
export function listenSpecifyDataChange(readPath:string,callBack: Function, db_path: string) {
  const db = getDatabase();
  const specifyDataRef = FireBaseRef(db, db_path + readPath);
  onValue(specifyDataRef, (snapshot) => {
    const data = snapshot.val();
    callBack(data);
  });
}


// @ 將資料寫入RTDB
export function setRTDBData(writePath: string, writeData: object, db_sercet:string=DB_SERCET) {
  const db = getDatabase();
  return set(FireBaseRef(db, db_sercet + writePath), writeData)
          .then((data)=> {console.log(data)})
          .catch((err) => {
            alert(err)
            throw new Error(err)
          });
}


// @ 將資料更新RTDB
export function updateRTDBData(updatePath: string, newData: object, db_sercet:string=DB_SERCET) {
  const db = getDatabase();
  const updates:updateType  = {};
  updates[db_sercet + updatePath] = newData
  return update(FireBaseRef(db), updates);
}


// @ 刪除資料
export function deleteRTDBData(deletePath: string,db_sercet:string=DB_SERCET) {
  const db = getDatabase();
  remove(FireBaseRef(db, db_sercet + deletePath));
}


// ##############################   type interface   ############################## //

interface updateType {
  [updatePath: string]: object
}