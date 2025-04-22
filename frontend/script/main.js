function appointmentsActionSelect() {
   const appointmentsSelectAction = document.querySelectorAll('.manage-appointments-table .action select');

  appointmentsSelectAction.forEach(select => {
    select.addEventListener('change', () => {
      function selectChangeColor(fontColor, borderColor, bgColor) {
        select.style.border = `1px solid ${borderColor}`;
        select.style.color = fontColor;
        select.style.backgroundColor = bgColor;
      }

      const value = select.value;
      if(value === 'accept'){
        selectChangeColor('#3777FF', '#3777FF', 'rgba(55, 118, 255, 0.2)');
      }else if(value === 'reschedule'){
        selectChangeColor('#A48014', '#A48014', 'rgba(164, 128, 20, 0.2)');
      }else{
        selectChangeColor('black', 'black', 'white');
      }
    })

    });
}

appointmentsActionSelect();


