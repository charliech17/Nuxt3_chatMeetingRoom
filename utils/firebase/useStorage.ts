import { getStorage, ref as firebaseRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { deleteObject, listAll  } from "firebase/storage";

export const uploadFile = ({uploadFile,uploadPath}: {uploadFile: File,uploadPath: string}): Promise<string> => {
    const storage = getStorage();
    const storageRef = firebaseRef(storage, uploadPath);

    const uploadTask = uploadBytesResumable(storageRef, uploadFile);

    return new Promise(
        (resolve) => {
            uploadTask.on( 'state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    }
                }, 
                (error) => {
                    // Handle unsuccessful uploads
                }, 
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        resolve(downloadURL)
                    });
                }
            );
        }
    )
}


export const deleteAllFolderFiles = (deleteFolderPath: string) => {
    const storage = getStorage();
    const listRef = firebaseRef(storage, deleteFolderPath);

    return listAll(listRef)
    .then((res) => {
        res.items.forEach((itemRef) => {
            const desertRef = firebaseRef(storage, deleteFolderPath + '/' + itemRef.name );
            deleteObject(desertRef).then(() => {
                //     // File deleted successfully
            }).catch((error) => {
                console.log('delete error',error)
                throw new Error(error)
            });
             
        });
    }).catch((error) => {
        // Uh-oh, an error occurred!
    });
    // return deleteObject(desertRef).then(() => {
    //     // File deleted successfully
    // }).catch((error) => {
    //     console.log('delete error',error)
    //     throw new Error(error)
    // });
}
