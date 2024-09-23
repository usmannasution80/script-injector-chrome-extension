(() => {

  let listTab = document.querySelector('[tab="list"]');
  let editTab = document.querySelector('[tab="edit"]');
  let editIndex = null;

  const refreshList = () => {

    chrome.storage.local.get('scripts', items => {
      let scripts = items.scripts || [];
      let listElement = listTab.querySelector('ul');
      let listElementContent = '';

      for(let i in scripts)
        listElementContent += `<li>${scripts[i].regex}</li>`;

      listElement.innerHTML = listElementContent;

      let listContentElements = listElement.getElementsByTagName('li');
      for(let i in listContentElements){
        listContentElements[i].onclick = e => {
          chrome.storage.local.get('scripts', items => {
            editIndex = i;
            let {
              regex,
              regexFlags,
              script
            } = items.scripts[editIndex];
            listTab.style.display = 'none';
            editTab.style.display = 'block';
          });
        };
      }

    });

  };

  refreshList();

  listTab.getElementsByTagName('button')[0].onclick = e => {
    listTab.style.display = 'none';
    editTab.style.display = 'block';
    editIndex = null;
  };

  let [
    editTabBackButton,
    saveEditTabButton
  ] = editTab.getElementsByTagName('button');

  editTabBackButton.onclick = e => {
    editTab.style.display = 'none';
    listTab.style.display = 'block';
  };

  saveEditTabButton.onclick = e => {
    chrome.storage.local.get('scripts', items => {
      let scripts = items.scripts || [];
      let script = {
        regex : editTab.querySelector('[name="regex"]').value,
        regexFlags : editTab.querySelector('[name="regex_flags"]').value,
        script : editTab.querySelector('[name="script"]').value
      };
      if(editIndex) scripts[editIndex] = script;
      else scripts.push(script);
      chrome.storage.local.set({scripts}, () => {
        refreshList();
        editTabBackButton.click();
      });
    });
  };

})();