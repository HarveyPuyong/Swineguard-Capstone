import popupAlert from '../../utils/popupAlert.js';
import handleRenderInventory from './display-inventory.js';


// ======================================
// ==========Handle Remove Item
// ======================================
const handleRemoveItem = async(itemId) => {
  try{
    const response = await axios.patch(`http://localhost:2500/inventory/remove/${itemId}`, {}, {withCredentials: true});

    if(response.status === 200){
      popupAlert('success', 'Success!', 'Item removed successfully')
        .then(() => {
          handleRenderInventory();
        });
    }

  } catch(err){
      console.log(err)
      const errMessage = err.response?.data?.message || err.response?.data?.error;
      popupAlert('error', 'Error!', errMessage);
  }
}


// ======================================
// ==========Handle Restore Item
// ======================================
const handleRestoreItem = async(itemId) => {
  try{
      const response = await axios.patch(`http://localhost:2500/inventory/restore/${itemId}`, {}, {withCredentials: true});
  
      if(response.status === 200){
        popupAlert('success', 'Success!', 'Item restore successfully').
          then(() => {
            handleRenderInventory();
          });
      }
  
  } catch(err){
      console.log(err)
      const errMessage = err.response?.data?.message || err.response?.data?.error;
      popupAlert('error', 'Error!', errMessage);
  }
}


// ======================================
// ==========Handle Delete Item
// ======================================
const handleDeleteItem = async(itemId) => {
  try{
      const response = await axios.delete(`http://localhost:2500/inventory/delete/${itemId}`, {}, {withCredentials: true});
  
      if(response.status === 200){
        popupAlert('success', 'Success!', 'Item Deleted successfully')
          .then(() => {
            handleRenderInventory();
          });
      }
  
  } catch(err){
      console.log(err)
      const errMessage = err.response?.data?.message || err.response?.data?.error;
      popupAlert('error', 'Error!', errMessage);
  }
}

export {handleRemoveItem, handleRestoreItem, handleDeleteItem}