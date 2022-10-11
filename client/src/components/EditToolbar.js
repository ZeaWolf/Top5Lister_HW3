import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    //let enabledButtonClass = "top5-button";
    function handleUndo() {
        if(store.tps.hasTransactionToUndo() && !editStatus){
            store.undo();
        }
    }
    function handleRedo() {
        if(store.tps.hasTransactionToRedo() && !editStatus){
            store.redo();
        }
    }
    function handleClose() {
        if((store.currentList !== null) && !editStatus){
            history.push("/");
            store.closeCurrentList();
        }
    }

    let editStatus = false;
    if (store.isListNameEditActive || store.isItemEditActive) {
        editStatus = true;
    }
    return (
        <div id="edit-toolbar">
            <div
                disabled={editStatus}
                id='undo-button'
                onClick={handleUndo}
                className={(store.tps.hasTransactionToUndo() && !editStatus)? "top5-button" : "top5-button-disabled" }>
                &#x21B6;
            </div>
            <div
                disabled={editStatus}
                id='redo-button'
                onClick={handleRedo}
                className={(store.tps.hasTransactionToRedo() && !editStatus)? "top5-button" : "top5-button-disabled"}>
                &#x21B7;
            </div>
            <div
                disabled={editStatus}
                id='close-button'
                onClick={handleClose}
                className={((store.currentList !== null) && !editStatus)? "top5-button" : "top5-button-disabled"}>
                &#x24E7;
            </div>
        </div>
    )
}

export default EditToolbar;