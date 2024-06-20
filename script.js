function select(number){
  const targetButton = event.target.closest('.select-button');
  console.log(targetButton);
  targetButton.classList.toggle('selected');
}
