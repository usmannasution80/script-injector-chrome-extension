(() => {
  let listTab = document.querySelector('[tab="list"]');
  let editTab = document.querySelector('[tab="edit"]');
  listTab.getElementsByTagName('button')[0].onclick = e => {
    listTab.style.display = 'none';
    editTab.style.display = 'block';
  };

  let editTabButtons = editTab.getElementsByTagName('button');
  editTabButtons[0].onclick = e => {
    editTab.style.display = 'none';
    listTab.style.display = 'block';
  };

})();