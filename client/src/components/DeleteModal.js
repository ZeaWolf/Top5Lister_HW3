import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
/*
    This modal is shown when the user asks to delete a list. Note 
    that before this is shown a list has to be marked for deletion,
    which means its id has to be known so that we can retrieve its
    information and display its name in this modal. If the user presses
    confirm, it will be deleted.
    
    @author McKilla Gorilla
*/
function DeleteModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    // if (store.currentList ) {
    //     name = store.currentList.name;
    // }
    function handleDeleteList(event) {
        store.deleteMarkedList();
    }
    function handleCloseModal(event) {
        store.hideDeleteListModal();
    }
    let modalClass = "modal";
    if(store.listMarkedForDeletion != null){
        modalClass = "modal is-visible";
        name = store.listMarkedForDeletion.name;
    }
    return (
        <div
            className={modalClass}
            id="delete-modal"
            data-animation="slideInOutLeft">
            <div className="modal-dialog">
                <header className="dialog-header">
                    Delete the Top 5 {name} List?
                </header>
                <div id="confirm-cancel-container">
                    <button
                        id="dialog-yes-button"
                        className="modal-button"
                        onClick={handleDeleteList}
                    >Confirm</button>
                    <button
                        id="dialog-no-button"
                        className="modal-button"
                        onClick={handleCloseModal}
                    >Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;