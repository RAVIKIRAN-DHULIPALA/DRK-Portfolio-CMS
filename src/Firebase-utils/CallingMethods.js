
import { uploadBytes, listAll } from "firebase/storage";
import { db, writeBatch, doc, onSnapshot, updateDoc, getDoc, deleteField, ref, storage, deleteObject, collection, addDoc, deleteDoc, uploadString, setDoc, query, auth } from "./config";

const myDB = "Mywork-DB";

const getUserData = (setUser, setInput) => {
    return auth.onAuthStateChanged((user) => {
        if (user) {
            setUser(user);
            let d = {
                "displayName": user.displayName,
                "photoURL": user.photoURL
            }
            if (setInput)
                setInput(d);
        }
        else {
            setUser(null);
        }
    })
}

const getOrderedData = (documentName, setData, key, setLoading) => {
    return onSnapshot(doc(db, myDB, documentName), (snapshot) => {
        const data = Object.values(snapshot.data()[key]).sort((a, b) => (a.order > b.order) ? 1 : -1)
        setData(data)
        if (setLoading)
            setLoading(false);
    });
}

const getDesignsData = (documentName, setData, key, setLoading) => {
    return onSnapshot(doc(db, myDB, documentName), (snapshot) => {
        const data = Object.values(snapshot.data()[key]);
        setData(data);
        setLoading(false);
    });
}
const updateShow = (documentname, slug, value, type) => {
    updateDoc(doc(db, myDB, documentname), {
        [`contents.${slug}.show`]: value
    })
}


const getParticularData = async (documentName, slug, setFormFields, type) => {
    await getDoc(doc(db, myDB, documentName)).then((i) => {
        if (i.exists()) {
            const key = type === "faq" ? "contents-1" : "contents";
            const data = i?.data();
            setFormFields({ ...data[key][`${slug}`] });
        }
    });
}

const getCaseStudyData = (slug, setData) => {
    return onSnapshot(doc(db, `${myDB}/UX case studies/casestudycontent/`, `${slug}`), (snapshot) => {
        setData(snapshot.data());
    })
}

const updateOrder = (data, docName) => {
    const batch = writeBatch(db);
    data.forEach(element => {
        const key = docName === "Faq's" ? "contents-1" : "contents";
        batch.update(doc(db, myDB, docName), {
            [`${key}.${element.slug}.order`]: element.order
        })
    })
    batch.commit();
}

const writeCasestudy = (documentname, batch, data) => {
    data.forEach(element => {
        batch.update(doc(db, myDB, documentname), {
            [`contents.${element.slug}`]: element
        });
        //add new doc with same slug in casestudycontent subcollection
        const collectionname = doc(db, `${myDB}/${documentname}/casestudycontent/`, `${element.slug}`);
        batch.set(collectionname, {
            category: element.category,
            title: element.title,
            metaimg: element.thumbnail_url,
            metaimgName: element.thumbnailName,
            html: "",
            img: "",
            imgName: "",
            css: "",
            cssName: "",
            pageTitle: "",
            textColor: "",
            font1: "",
            font2: "",
            desp: "",
            continue: [],
            assets: {},
            TOB: [{ name: "", linkTo: "" }],
            bgColor: ""
        });
        const folderRef = ref(storage, `casestudycontent/${element.slug}/one`);
        uploadBytes(folderRef, new Uint8Array([0]));

    });
}
const writePosts = (documentname, batch, data, key) => {
    data.forEach(element => {
        batch.update(doc(db, myDB, documentname), {
            [`${key}.${documentname === "My Writings" ? element.referenceTitle : element.category}`]: element
        });
    });
}
const writeDesigns = (documentname, batch, data, key) => {
    data.forEach(element => {
        batch.update(doc(db, myDB, documentname), {
            [`${key}.${element.key}`]: element
        });
    });
}
const writeFaqs = (documentname, batch, data, key) => {
    data.forEach(element => {
        batch.update(doc(db, myDB, documentname), {
            [`${key}.${element.question}`]: element
        });
    });
}

const AddData = (documentname, data) => {
    const batch = writeBatch(db);
    switch (documentname) {
        case "UX case studies": writeCasestudy(documentname, batch, data); break;
        case "UX Posts": writePosts(documentname, batch, data, "contents"); break;
        case "My Writings": writePosts(documentname, batch, data, "contents"); break;
        case "UI Designs-Animations": writeDesigns(documentname, batch, data, "contents"); break;
        case "Faq's": writeFaqs(documentname, batch, data, "contents-1"); break;
    }
    batch.commit();
}

const UpdateLinks = (data) => {
    const batch = writeBatch(db);
    data.forEach(element => {
        batch.update(doc(db, myDB, "portfolioLinks"), {
            [`links.${element.key}`]: element
        });
    });
    batch.commit();
}

const UpdateData = (documentname, data, key, type) => {
    if (type === "faq") {
        updateDoc(doc(db, myDB, documentname), {
            [`contents-1.${key}`]: data
        })
    }
    updateDoc(doc(db, myDB, documentname), {
        [`contents.${key}`]: data
    })
}


const updatecasestudyContent = (slug, data, SetState) => {
    updateDoc(doc(db, `${myDB}/UX case studies/casestudycontent/`, slug), data);
    SetState("synced");
}

const setFilesData = (id, data) => {
    setDoc(doc(db, `${myDB}/UX case studies/casestudycontent/`, id), {
        [`assets`]: data
    }, { merge: true })
}


const deleteFieldData = (documentName, slug, thumbnailName, type, containerName) => {

    const batch = writeBatch(db);
    //deleting the slugged content from case study
    if (type === "faq") {
        batch.update(doc(db, myDB, documentName), {
            [`contents-1.${slug}`]: deleteField()
        })
    }
    batch.update(doc(db, myDB, documentName), {
        [`contents.${slug}`]: deleteField()
    })
    //deleting the casestudycontent document based on slug
    if (type === "casestudy") {
        batch.delete(doc(db, myDB, documentName, "casestudycontent", slug));
        listAll(ref(storage, `casestudycontent/${slug}`))
            .then((res) => {
                res.items.forEach((itemRef) => {
                    deleteObject(itemRef)
                });
            }).catch((error) => {
                // Uh-oh, an error occurred!
            });
    }

    //committing the batch operation
    batch.commit()

    //deleting the thumbnail from storage
    deleteObject(ref(storage, `${containerName}/${thumbnailName}`)).catch((error) => { });

}
const getCaseStudyContentFolders = (setData, setLoading) => {
    const q = query(collection(db, `${myDB}/UX case studies/casestudycontent`))
    return onSnapshot(q, (snapshot) => {
        const names = snapshot.docs.map((doc) => doc.id)
        setData(names);
        setLoading(false)
    })
}
const getCasestudyFolderContent = (id, setData, setLoading) => {
    return onSnapshot(doc(db, `${myDB}/UX case studies/casestudycontent/`, `${id}`), (snapshot) => {
        setData(Object.values(snapshot.data()['assets']));
        setLoading(false)
    })
}

const deleteFolderContent = (id, name, key) => {
    updateDoc(doc(db, `${myDB}/UX case studies/casestudycontent/`, id), {
        [`assets.${key}`]: deleteField()
    })
    deleteObject(ref(storage, `casestudycontent/${id}/${name}`)).catch((err) => { console.log(err) })

}



const removecssMockupfile = (slug, formdata, setFormData, file, setFile, type, typename) => {
    const desertRef = ref(storage, `casestudycontent/${slug}/${file}`);
    // Delete the file
    deleteObject(desertRef).then(() => {
        let data = { ...formdata };
        data[type] = "";
        data[typename] = "";
        setFile("");
        setFormData(data)
    }).catch((error) => {
        // Uh-oh, an error occurred!
    });

}



const removethumbnail = (index, name, formFields, setFormFields, file, setFile, folder) => {
    const desertRef = ref(storage, `${folder}/${file.name}`);
    // Delete the file
    deleteObject(desertRef).then(() => {
        let data = [...formFields];
        data[index][`${name}`] = "";
        data[index][`thumbnailName`] = "";
        setFormFields(data)
        setFile("");
    }).catch((error) => {
        // Uh-oh, an error occurred!
    });
}
const replaceThumbnail = (containername, name, formFields, setFormFields) => {
    const desertRef = ref(storage, `${containername}/${name}`);
    deleteObject(desertRef).then(() => {
        let data = { ...formFields };
        data["thumbnail_url"] = "";
        data[`thumbnailName`] = "";
        setFormFields(data)
    }).catch((error) => {
        let data = { ...formFields };
        data["thumbnail_url"] = "";
        data[`thumbnailName`] = "";
        setFormFields(data)
        // Uh-oh, an error occurred!
    });
}

export {
    getUserData,
    getOrderedData,
    updateShow,
    getParticularData,
    AddData,
    UpdateData,
    updatecasestudyContent,
    deleteFieldData,
    removethumbnail,
    replaceThumbnail,
    getCaseStudyData,
    removecssMockupfile,
    getDesignsData,
    setFilesData,
    getCaseStudyContentFolders,
    getCasestudyFolderContent,
    deleteFolderContent,
    UpdateLinks,
    updateOrder
}