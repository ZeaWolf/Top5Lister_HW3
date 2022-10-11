import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveItem_Transaction from '../transactions/MoveItem_Transaction'
import ChangeItem_Transaction from '../transactions/ChangeItem_Transaction'
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    SET_ITEM_NAME_EDIT_ACTIVE: "SET_ITEM_NAME_EDIT_ACTIVE",
    SET_LIST_MARKED_FOR_DELETION: "SET_LIST_MARKED_FOR_DELETION",
    // ADD_NEW_LIST: "ADD_NEW_LIST"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 1,
        listNameActive: false,
        itemActive: false,
        listMarkedForDeletion: null,
        tps: tps
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null, //payload.top5List,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    tps: tps
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    tps: tps
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null, //null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    tps: tps
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    tps: tps
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    tps: tps
                });
            }
            case GlobalStoreActionType.SET_ITEM_NAME_EDIT_ACTIVE:{
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: true,
                    listMarkedForDeletion: null,
                    tps: tps
                });
            }
            case GlobalStoreActionType.SET_LIST_MARKED_FOR_DELETION:{
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload,
                    tps: tps
                });
            }
            // case GlobalStoreActionType.ADD_NEW_LIST:{
            //     return setStore({
            //         idNamePairs: store.idNamePairs,
            //         currentList: null,
            //         newListCounter: payload,
            //         isListNameEditActive: false,
            //         isItemEditActive: false,
            //         listMarkedForDeletion: null,
            //         tps: tps
            //     });
            // }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;
                top5List.name = newName;
                async function updateList(top5List) {
                    response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        async function getListPairs(top5List) {
                            response = await api.getTop5ListPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        top5List: top5List
                                    }
                                });
                            }
                        }
                        getListPairs(top5List);
                    }
                }
                updateList(top5List);
            }
        }
        if(newName === ""){
            return setStore({
                idNamePairs: store.idNamePairs,
                currentList: null, //payload.top5List,
                newListCounter: store.newListCounter,
                isListNameEditActive: false,
                isItemEditActive: false,
                listMarkedForDeletion: null,
                tps: tps
            });
        }
        else{
            asyncChangeListName(id);
        }
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        if(store.currentList !== null){
            storeReducer({
                type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
                payload: {}
            });
            tps.clearAllTransactions();
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getTop5ListPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;

                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: top5List
                    });
                    store.history.push("/top5list/" + top5List._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    //Part 1: Create New List
    store.createNewList = function(){
        async function asyncCreateNewList() {
            let name = "Untitled" + store.newListCounter
            let newList = {
                "name": name,
                "items": ["?","?","?","?","?"]
            };
            let response = await api.createTop5List(newList);
            if (response.data.success){
                store.newListCounter++;
                let id = response.data.top5List._id;
                store.setCurrentList(id);
                store.loadIdNamePairs();
            }
        }
        asyncCreateNewList();
    }

    store.addMoveItemTransaction = function (start, end) {
        let transaction = new MoveItem_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    store.moveItem = function (start, end) {
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = store.currentList.items[start];
            for (let i = start; i < end; i++) {
                store.currentList.items[i] = store.currentList.items[i + 1];
            }
            store.currentList.items[end] = temp;
        }
        else if (start > end) {
            let temp = store.currentList.items[start];
            for (let i = start; i > end; i--) {
                store.currentList.items[i] = store.currentList.items[i - 1];
            }
            store.currentList.items[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }

    //Part 2
    store.addChangeItemTransaction = function (id, newText) {
        let oldText = store.currentList.items[id];
        let transaction = new ChangeItem_Transaction(store, id, oldText, newText);
        tps.addTransaction(transaction);
    }

    store.changeItem = function(index, newName){
        let temp = store.currentList;
        for(let i = 0; i < temp.items.length; i++){
            if(i === index){
                temp.items[i] = newName;
            }
        }
        store.updateCurrentList();
    }

    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        if(tps.hasTransactionToUndo()){
            tps.undoTransaction();
        }
    }
    store.redo = function () {
        if(tps.hasTransactionToRedo()){
            tps.doTransaction();
        }
    }

    //Part 2
    store.setIsItemNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_ITEM_NAME_EDIT_ACTIVE,
            payload: store.currentList
        });
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    //Part3
    store.setListMarkedForDeletion = function(id){
        // let listForDeletion = null;
        // api.getTop5ListById(id).then(
        //     (response, err) =>{
        //         listForDeletion = response.data.top5List;
        //         storeReducer({
        //             type: GlobalStoreActionType.SET_LIST_MARKED_FOR_DELETION,
        //             payload: listForDeletion
        //         });
        //     }
        // );
        async function asyncSetListMarkedForDeletion(id) {
            let response = await api.getTop5ListById(id);
            let listForDeletion = null;
            if (response.data.success) {
                listForDeletion = response.data.top5List;
            }
            
            storeReducer({
                type: GlobalStoreActionType.SET_LIST_MARKED_FOR_DELETION,
                payload: listForDeletion
            });
        }
        asyncSetListMarkedForDeletion(id);
    }
    store.deleteMarkedList = function(){
        let id = store.listMarkedForDeletion._id;
        
        // api.deleteTop5ListById(id).then(
        //     () =>{
        //         store.hideDeleteListModal();
        //         store.loadIdNamePairs();
        //     }
        // );
        // store.hideDeleteListModal();
        // store.loadIdNamePairs();
        async function asyncDeleteMarkedList(id) {
            let response = await api.deleteTop5ListById(id);
            if (response.data.success) {
                console.log(response);
                store.hideDeleteListModal();
                store.loadIdNamePairs();
            }
        }
        asyncDeleteMarkedList(id);
    }
    store.hideDeleteListModal = function(){
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_MARKED_FOR_DELETION,
            payload: null
        });
    }


    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}