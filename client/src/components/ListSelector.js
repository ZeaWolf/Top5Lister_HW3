import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ListCard from './ListCard.js'
import { GlobalStoreContext } from '../store'
import DeleteModal from './DeleteModal'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const ListSelector = () => {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    //Part 1 Create New List
    function sendNewList(){
        if( (!store.isListNameEditActive) && ((store.currentList == null)) ){
            store.createNewList();
            // let newList = {
            //         "name": "Untitled",
            //         "items": ["?","?","?","?","?"]
            // };
            // apis.createTop5List(newList).then(
            //     (response, err)=>{
            //         let id = response.data.top5List._id;
            //         store.setCurrentList(id);
            //         store.loadIdNamePairs();
            //     }
            // ); 
        }
    }

    let listCard = "";
    if (store) {
        listCard = store.idNamePairs.map((pair) => (
            <ListCard
                key={pair._id}
                idNamePair={pair}
                selected={false}
            />
        ))
    }
    return (
        <div id="top5-list-selector">
            <div id="list-selector-heading">
                <input
                    type="button"
                    id="add-list-button"
                    className={store.isListNameEditActive ? "top5-button-disabled" : "top5-button"}
                    onClick = {sendNewList}
                    value="+" />
                Your Lists
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
                <DeleteModal />
            </div>
        </div>)
}

export default ListSelector;