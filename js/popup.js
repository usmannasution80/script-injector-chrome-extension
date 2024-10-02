(() => {

  let editIndex = null;

  const toggleTab = tab => {
    let tabElements = document.querySelectorAll('[tab]');
    for(let tabElement of tabElements){
      if(tabElement.getAttribute('tab') !== tab){
        tabElement.style.display = 'none';
        continue;
      }
      tabElement.style.display = 'block';
      switch(tab){
        case 'edit':
          setEditTab();
          break;
        default:
          editIndex = null;
          refreshList();
      }
    }
  };

  const setEditTab = () => {
    if(editIndex){
      chrome.storage.local.get('scripts', items => {

        if(!items.scripts) return;

        let {
          regex,
          regexFlags,
          script
        } = items.scripts[editIndex];

        let editTab = document.querySelector('[tab="edit"]');

        editTab.querySelector('[name="regex"]').value = regex;
        editTab.querySelector('[name="regex_flags"]').value = regex_flags;
        editTab.querySelector('[name="script"]').value = script;

      });
    }
  };

  const refreshList = () => {

    chrome.storage.local.get('scripts', items => {
      let scripts = items.scripts || [];
      let listTab = document.querySelector('[tab="list"]');
      let listElement = listTab.querySelector('ul');
      let listElementContent = '';

      for(let i in scripts)
        listElementContent += `<li>${scripts[i].regex}</li>`;

      listElement.innerHTML = listElementContent;

      let listContentElements = listElement.getElementsByTagName('li');
      for(let i in listContentElements){
        listContentElements[i].onclick = e => {
          editIndex = i;
          toggleTab('edit');
        };
      }

    });

  };

  let tabTogglers = document.querySelectorAll('[toggle="tab"]');
  for(let tabToggler of tabTogglers)
    tabToggler.onclick = e => toggleTab(tabToggler.getAttribute('target'));

  document.querySelector('[tab="edit"]').querySelector('[name="save"]').onclick = e => {
    chrome.storage.local.get('scripts', items => {
      let editTab = document.querySelector('[tab="edit"]');
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
        toggleTab('list');
      });
    });
  };

  refreshList();

})();