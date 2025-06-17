const setItemsColor = (statusValue, item) => {
  if(statusValue === 'in-stock'){
    item.style.setProperty('--bgColor', 'rgba(40, 167, 70, 0.88)')
  } else if (statusValue === 'less-stock'){
    item.style.setProperty('--bgColor', 'rgba(255, 166, 0, 0.88)');
  } else if(statusValue === 'out-of-stock'){
    item.style.setProperty('--bgColor', 'rgb(229, 79, 25)');
  } else if(statusValue === 'expired'){
    item.style.setProperty('--bgColor', 'rgba(170, 0, 0, 0.77)');
  } else if(statusValue === 'removed'){
    item.style.setProperty('--bgColor', 'rgba(105, 105, 105, 0.71)');
  } 
}

const changeItemsColor = () => {
  const items = document.querySelectorAll('.inventory-table__tbody .medicine');

  items.forEach(item => {
    console.log(item)
    const status = item.querySelector('.td.status');
    const statusValue = status.getAttribute('data-status-value');

    setItemsColor(statusValue, item);
  });
}



export default function setupInventorySection() {
  changeItemsColor();
}